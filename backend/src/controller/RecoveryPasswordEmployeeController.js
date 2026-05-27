import jsonwebtoken from "jsonwebtoken" //Generador de tokens
import bcrypt from "bcryptjs"//Encriptacion de contrasenas
import nodemailer from "nodemailer" //Para enviar correos
import crypto from "crypto"

import HTMLRecoveryEmail from "../utils/sendMailRecovery.js"

import {config} from "../../config.js"
import employeeModel from "../model/Employees.js"

const recoveryPasswordEmployeeController = {}

recoveryPasswordEmployeeController.requestCode = async (req,res) => {
    try {
        
        const {email} = req.body

        //Validar si el correo exista

        const employeeFound = await employeeModel.findOne({email});


        if(!employeeFound) {
            return res.status(404).json({message: "Not found"})
        }

        //Generamos el codigo aleatorio 

        const randomCode = crypto.randomBytes(3).toString("hex")

        //Lo guardamos todo en un token

        const token = jsonwebtoken.sign(
            //Lo que vamos a guardar 
            {email,randomCode, userType: "employee", verified: false},

            //Secret key
            config.JWT.secret,

            //Expiracion
            {expiresIn: "15m"}
        );

        res.cookie("recoveryCookie", token, {maxAge:  15 * 60 * 1000});

        //Enviar el codigo por correo electronico
        //Quien lo envia

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            },
        });


        //Lo recibe 
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Recuperación de contraseña",
            body: "El código vence en 15 minutos",
            html: HTMLRecoveryEmail(randomCode),
        };


        //Enviamos el correo electronico

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log("error"+error);
                return res.status(500).json({message: "Error sending mail"})
            }
            return res.status(200).json({message: "email sent"})
        });
    } catch (error) {
         console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

recoveryPasswordEmployeeController.verifyCode = async (req,res) => {
    try {
        
        const {code} = req.body;

        //Obtenemos la informacion dentro del token
        //Accedemos a la cookie
        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token,config.JWT.secret);

        //Comparamos lo que el administrador escribio con el que esta en el token

        if(code !== decoded.randomCode){
            return res.status(400).json({message: "Invalid code"})
        }

        //Si escribe bien vamos a colocar que esta verificado

        const newToken = jsonwebtoken.sign(
            //Lo que vamos a guardar
            {email: decoded.email, userType: "employee", verified: true},

            //Secret key
            config.JWT.secret,

            //Expiracion
            { expiresIn: "15m" },
        
        );

         res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified successfully" });


    } catch (error) {
         console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
    }
}

recoveryPasswordEmployeeController.newPassword = async (req, res) => {
    try {
        const { newPassword, confirmNewPassword } = req.body;

    //Comparo las dos contraseñas
        if (newPassword !== confirmNewPassword) {
       return res.status(400).json({ message: "Password doesnt match" });
    }
    
    //Vamos a comprobar que la constante verified que está en el token
    //ya esté en true (O sea qu haya pasado por el paso 2)
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    //Encriptar la contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    //Actualizar la contraseña en la base de datos
    await employeeModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export default recoveryPasswordEmployeeController;