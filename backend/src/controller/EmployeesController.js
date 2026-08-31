import employeeModel from "../model/Employees.js"

//Creo un array de funciones
const employeeController = {};

//SELECT
employeeController.getEmployees = async (req, res) => {
    try {
        const employee = await employeeModel.find();
        return res.status(200).json(employee)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//UPDATE
employeeController.updateEmployees = async (req, res) => {
    try {
  
      let {
        name,
        email,
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
      if (!name || !email || !phone){
        return res.status(400).json({message: "All fields are required"});
      }
  
      // Validar nombre
      if (name.length < 3 || name.length > 50){
        return res.status(400).json({message: "Name must contain between 3 and 50 characters"});
      }
  
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(email)){
        return res.status(400).json({message: "Invalid email"});
      }
  
      // Validar teléfono
      const phoneRegex = /^[0-9]{8}$/;
  
      if (!phoneRegex.test(phone)){
        return res.status(400).json({message: "Phone must contain exactly 8 digits"});
      }
  
      // Verificar si el email ya existe en otro empleado
      const existingEmployee = await employeeModel.findOne({
        email,
        _id: { $ne: req.params.id }
      });
  
      if (existingEmployee){
        return res.status(400).json({message: "Email already exists"});
      }
  
      // Actualizar empleado
      const employeeUpdated = await employeeModel.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          phone,
          DateContract,
          Status,
          isActive
        },
        { new: true }
      );
  
      if (!employeeUpdated) {
        return res.status(404).json({message: "Employee not found"});
      }
  
      return res.status(200).json({message: "Employee updated"});
  
    } catch (error) {
      console.log("error " + error);
      return res.status(500).json({message: "Internal Server Error"});
    }
};

//ELIMINAR
employeeController.deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await employeeModel.findByIdAndDelete(req.params.id);

        if(!deletedEmployee){
            return res.status(404).json({message: "Employee not found"})
        }

        return res.status(200).json({message: "Employee deleted"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default employeeController;