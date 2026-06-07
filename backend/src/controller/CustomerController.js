import customerModel from "../model/Customer.js"

//Creo un array de funciones
const customerController = {};

//SELECT
customerController.getCustomers = async (req, res) => {
    try {
        const customer = await customerModel.find();
        return res.status(200).json(customer)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//UPDATE
customerController.updateCustomers = async (req, res) => {
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
      if (!name || !email || !phone){
        return res.status(400).json({message: "All fields are required"});
      }
  
      // Validar nombre
      if (name.length < 3 || name.length > 50){
        return res.status(400).json({message: "Name must contain between 3 and 50 characters"});
      }

      // Validar apellido
      if (lastname.length < 3 || lastname.length > 50){
        return res.status(400).json({message: "Lastname must contain between 3 and 50 characters"});
      }
  
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(email)){
        return res.status(400).json({message: "Invalid email"});
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

      if (age < 18) {
        return res.status(400).json({message: "Customer must be at least 18 years old"});
      }

      //Validar si existe el DUI
      const existingDUI = await customerModel.findOne({ DUI, _id: { $ne: req.params.id }});

      if (existingDUI) {
        return res.status(400).json({message: "DUI already exists"});
      }
  
      // Validar teléfono
      const phoneRegex = /^[0-9]{8}$/;
  
      if (!phoneRegex.test(phone)){
        return res.status(400).json({message: "Phone must contain exactly 8 digits"});
      }
  
      // Verificar si el email ya existe en otro empleado
      const existingCustomer = await customerModel.findOne({
        email,
        _id: { $ne: req.params.id }
      });
  
      if (existingCustomer){
        return res.status(400).json({message: "Email already exists"});
      }
  
      // Actualizar empleado
      const customerUpdated = await customerModel.findByIdAndUpdate(
        req.params.id,
        {
            name,
            lastname,
            birthdate,
            phone,
            email,
            password,
            DUI,
            isActive
        },
        { new: true }
      );
  
      if (!customerUpdated) {
        return res.status(404).json({message: "Customer not found"});
      }
  
      return res.status(200).json({message: "Customer updated"});
  
    } catch (error) {
      console.log("error " + error);
      return res.status(500).json({message: "Internal Server Error"});
    }
};

//ELIMINAR
customerController.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await customerModel.findByIdAndDelete(req.params.id);

        if(!deletedCustomer){
            return res.status(404).json({message: "Customer not found"})
        }

        return res.status(200).json({message: "Customer deleted"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default customerController;