import customerModel from "../model/Customer.js"
import bcrypt from "bcryptjs";

const customerController = {};

customerController.insertCustomers = async (req, res) => {
    try {
      let {
        name,
        lastname,
        birthdate,
        phone,
        email,
        password,
        DUI,
        isActive
      } = req.body;
  
      // Sanitizar
      name = name?.trim();
      email = email?.trim().toLowerCase();
      phone = phone?.trim();
  
      // Campos obligatorios
      if (!name || !email || !password || !phone) {
        return res.status(400).json({message: "All fields are required"});
      }
  
      // Nombre
      if (name.length < 3 || name.length > 50 ) {
        return res.status(400).json({message: "Name must contain between 3 and 50 characters"});
      }

      // Apellido
      if (lastname.length < 3 || lastname.length > 50 ) {
        return res.status(400).json({message: "Lastname must contain between 3 and 50 characters"});
      }

      //DUI
      const duiRegex = /^\d{8}-\d$/;

      if (!duiRegex.test(DUI)) {
        return res.status(400).json({message: "Invalid DUI format. Example: 12345678-9"});
      }

      //BirthDate
      const birthDateObj = new Date(birthdate);

      if (isNaN(birthDateObj.getTime())) {
        return res.status(400).json({message: "Invalid birthdate"});
      }

      const today = new Date();

      let age = today.getFullYear() - birthDateObj.getFullYear();

      const monthDiff = today.getMonth() - birthDateObj.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }

      if (age < 15) {
        return res.status(400).json({message: "Customer must be at least 15 years old"});
      }

      //Validar si existe el DUI
      const existingDUI = await customerModel.findOne({ DUI });

      if (existingDUI) {
        return res.status(400).json({message: "DUI already exists"});
      }
  
      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(email)) {
        return res.status(400).json({message: "Invalid email"});
      }
  
      // Contraseña
      if (password.length < 8) {
        return res.status(400).json({message: "Password must contain at least 8 characters"});
      }
  
      // Teléfono
      const phoneRegex = /^[0-9]{8}$/;
  
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({message: "Phone must contain exactly 8 digits"});
      }
  
      // Verificar email repetido
      const existingCustomer = await customerModel.findOne({ email });
  
      if (existingCustomer) {
        return res.status(400).json({message: "Email already exists"});
      }
  
      // Encriptar contraseña
      const passwordHash = await bcrypt.hash(password, 10);
  
      const newCustomer = new customerModel({
        name,
        lastname,
        birthdate,
        email,
        password: passwordHash,
        phone,
        DUI,
        isActive: true
      });
  
      await newCustomer.save();
  
      return res.status(201).json({message: "Customer saved"});
  
    } catch (error) {
      console.log("error" +error);
      return res.status(500).json({message: "Internal Server Error"});
    }
};

export default customerController;