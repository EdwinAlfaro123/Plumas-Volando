// backend/src/controller/LoginCustomerController.js
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";
import customerModel from "../model/Customer.js";

const LoginCustomerController = {};

LoginCustomerController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el cliente por email
    const customerFound = await customerModel.findOne({ email });

    if (!customerFound) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    // Verificar si el usuario está activo
    if (customerFound.isActive === false) {
      return res.status(403).json({ 
        success: false,
        message: "Cuenta desactivada" 
      });
    }

    // Verificar bloqueo por intentos fallidos
    if (customerFound.timeOut && customerFound.timeOut > Date.now()) {
      const tiempoRestante = Math.ceil((customerFound.timeOut - Date.now()) / 60000);
      return res.status(403).json({ 
        success: false,
        message: `Cuenta bloqueada por 5 minutos. Intenta nuevamente en ${tiempoRestante} minuto(s)` 
      });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, customerFound.password);

    if (!isMatch) {
      // Incrementar intentos fallidos
      customerFound.loginAttemps = (customerFound.loginAttemps || 0) + 1;

      if (customerFound.loginAttemps >= 5) {
        customerFound.timeOut = Date.now() + 5 * 60 * 1000; // Bloquear por 5 minutos
        customerFound.loginAttemps = 0;
        await customerFound.save();
        
        return res.status(403).json({
          success: false,
          message: "Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.",
        });
      }

      await customerFound.save();

      return res.status(401).json({ 
        success: false,
        message: "Contraseña incorrecta" 
      });
    }

    // Reiniciar intentos fallidos
    customerFound.loginAttemps = 0;
    customerFound.timeOut = null;
    await customerFound.save();

    // Generar token JWT
    const token = jsonwebtoken.sign(
      {
        id: customerFound._id,
        email: customerFound.email,
        userType: "customer",
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
      secure: false,
      sameSite: "lax",
    });

    // Devolver datos del usuario
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      customer: {
        _id: customerFound._id,
        name: customerFound.name,
        lastname: customerFound.lastname,
        email: customerFound.email,
        phone: customerFound.phone,
        DUI: customerFound.DUI,
        isActive: customerFound.isActive,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor" 
    });
  }
};

export default LoginCustomerController;