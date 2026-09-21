import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";
import employeeModel from "../model/Employees.js";

const loginEmployeeController = {};

loginEmployeeController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el empleado por email
    const employeeFound = await employeeModel.findOne({ email });
    if (!employeeFound) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    // Verificar si el usuario está activo
    if (employeeFound.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Cuenta desactivada",
      });
    }

    // Verificar bloqueo por intentos fallidos
    if (employeeFound.timeOut && employeeFound.timeOut > Date.now()) {
      const tiempoRestante = Math.ceil(
        (employeeFound.timeOut - Date.now()) / 60000
      );
      return res.status(403).json({
        success: false,
        message: `Cuenta bloqueada por 5 minutos. Intenta nuevamente en ${tiempoRestante} minuto(s)`,
      });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, employeeFound.password);
    if (!isMatch) {
      // Incrementar intentos fallidos
      employeeFound.loginAttemps = (employeeFound.loginAttemps || 0) + 1;
      if (employeeFound.loginAttemps >= 5) {
        employeeFound.timeOut = Date.now() + 5 * 60 * 1000;
        employeeFound.loginAttemps = 0;
        await employeeFound.save();
        return res.status(403).json({
          success: false,
          message: "Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.",
        });
      }
      await employeeFound.save();
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    // Reiniciar intentos fallidos
    employeeFound.loginAttemps = 0;
    employeeFound.timeOut = null;
    await employeeFound.save();

    // Generar token JWT
    const token = jsonwebtoken.sign(
      {
        id: employeeFound._id,
        email: employeeFound.email,
        userType: "employee",
      },
      config.JWT.secret,
      {
        expiresIn: "30d",
      }
    );

    // Establecer cookie
    res.cookie("authCookie", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // ✅ CORREGIDO: Devolver token y datos del empleado
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      employee: {
        _id: employeeFound._id,
        name: employeeFound.name,
        lastName: employeeFound.lastName || "",
        email: employeeFound.email,
        phone: employeeFound.phone,
        Status: employeeFound.Status,
        isActive: employeeFound.isActive,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export default loginEmployeeController;