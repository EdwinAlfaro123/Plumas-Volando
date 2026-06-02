import employeeModel from "../model/Employees.js"
import bcrypt from "bcryptjs";

const employeeController = {};

employeeController.insertEmployees = async (req, res) => {
    try {
      let {
        name,
        email,
        password,
        phone,
        DateContract,
        Status,
        isActive
      } = req.body;
  
      // Sanitizar
      name = name?.trim();
      email = email?.trim().toLowerCase();
      phone = phone?.trim();
  
      // Campos obligatorios
      if (!name || !email || !password || !phone) {
        return res.status(400).json({
          message: "All fields are required"
        });
      }
  
      // Nombre
      if (name.length < 3 || name.length > 50) {
        return res.status(400).json({
          message: "Name must contain between 3 and 50 characters"
        });
      }
  
      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Invalid email"
        });
      }
  
      // Contraseña
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must contain at least 8 characters"
        });
      }
  
      // Teléfono
      const phoneRegex = /^[0-9]{8}$/;
  
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Phone must contain exactly 8 digits"
        });
      }
  
      // Verificar email repetido
      const existingEmployee = await employeeModel.findOne({ email });
  
      if (existingEmployee) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }
  
      // Encriptar contraseña
      const passwordHash = await bcrypt.hash(password, 10);
  
      const newEmployee = new employeeModel({
        name,
        email,
        password: passwordHash,
        phone,
        DateContract,
        Status,
        isActive: true
      });
  
      await newEmployee.save();
  
      return res.status(201).json({
        message: "Employee saved"
      });
  
    } catch (error) {
      console.log("error" +error);
      return res.status(500).json({message: "Internal Server Error"});
    }
};

export default employeeController;