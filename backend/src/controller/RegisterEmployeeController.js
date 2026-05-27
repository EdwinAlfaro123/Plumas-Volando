import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import employeeModel from "../model/Employees.js";
import { config } from "../../config.js";
import HTMLVerificationCode from "../utils/sentMailVerificationCode.js";

import { v2 as cloudinary } from "cloudinary";

const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      DateContract,
      Status,
      isActive,
      isVerified,
      loginAttemps,
      timeOut,
    } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({
        message: "Llena todos los campos obligatorios",
      });
    }

    const existsEmployee = await employeeModel.findOne({ email });

    if (employeeModel) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const passwordHashed = await bcryptjs.hash(password, 10);
    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      {
        randomCode,
        name,
        email,
        phone,
        DateContract,
        password: passwordHashed,
        isActive: isActive ?? true,
        isVerified: isVerified ?? false,
        loginAttemps: loginAttemps ?? 0,
        timeOut: timeOut ?? null,
      },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("registrationCookieEmployee", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta de empleado",
      html: HTMLVerificationCode(randomCode),
    };

    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        console.log("error " + error);

        return res.status(500).json({
          message: "Error sending email",
        });
      }

      return res.status(200).json({
        message: "Email sent",
      });
    });
  } catch (error) {
    console.log("error " + error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

registerEmployeeController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;
    const token = req.cookies.registrationCookieEmployee;

    if (!token) {
      return res.status(400).json({
        message: "No verification token found",
      });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    const {
      randomCode: storedCode,
      name,
      lastName,
      phone,
      DateContract,
      email,
      password,
      isActive,
      loginAttemps,
      timeOut,
    } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({
        message: "Invalid code",
      });
    }

    const existsEmployee = await employeeModel.findOne({ email });

    if (existsEmployee) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const newEmployee = new employeeModel({
      name,
      lastName,
      phone,
      DateContract,
      email,
      password,
      isActive: isActive ?? true,
      isVerified: true,
      loginAttemps: loginAttemps ?? 0,
      timeOut: timeOut ?? null,
    });

    await newEmployee.save();

    res.clearCookie("registrationCookieEmployee");

    return res.status(200).json({
      message: "Employee registered",
    });
  } catch (error) {
    console.log("error " + error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default registerEmployeeController;