import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
 
import { config } from "../../config.js";
import employeeModel from "../model/Employees.js";
 
const loginEmployeeController = {};
 
loginEmployeeController.login = async (req, res) => {
 
  try {
    const { email, password } = req.body;
 
    const employeeFound = await employeeModel.findOne({ email });
 
    if (!employeeFound) {
      return res.status(404).json({ message: "Not found" });
    }
 
    if (employeeFound.timeOut && employeeFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Blocked account" });
    }
 
    const isMatch = await bcrypt.compare(password, employeeFound.password);
 
    if (!isMatch) {
      employeeFound.loginAttemps = (employeeFound.loginAttemps || 0) + 1;
 
      if (employeeFound.loginAttemps >= 5) {
        employeeFound.timeOut = Date.now() + 5 * 60 * 1000;
        employeeFound.loginAttemps = 0;
 
        await employeeFound.save();
 
        return res.status(403).json({
          message: "Blocked account for many attempts",
        });
      }
 
      await employeeFound.save();
 
      return res.status(401).json({ message: "Wrong password" });
    }
 
    employeeFound.loginAttemps = 0;
 
    employeeFound.timeOut = null;
 
    await employeeFound.save();
 
    const token = jsonwebtoken.sign(
      {
        id: employeeFound._id,
        userType: "employee",
      },
      config.JWT.secret,
      {
        expiresIn: "30d",
      }
    );
 
 
    res.cookie("authCookie", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
 
 
    return res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
 
export default loginEmployeeController;