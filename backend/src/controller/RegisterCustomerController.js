import bcryptjs from "bcryptjs" // Encriptar contraseña
import customerModel from "../model/Customers.js" // Tu nuevo modelo de Mongoose

const registerCustomerController = {}

registerCustomerController.register = async (req, res) => {
    try {
        // 1. Solicitar los datos a guardar basándonos en tu nuevo Schema
        const { 
            name, 
            lastname, 
            birthdate, 
            phone, 
            email, 
            password, 
            DUI, 
            isActive, 
            isVerified, 
            loginAttemps, 
            timeOut 
        } = req.body

        // 2. Validar si el correo ya existe en la base de datos
        const existsCustomer = await customerModel.findOne({ email })
        if (existsCustomer) {
            return res.status(400).json({ message: "Customer already exists" })
        }

        // 3. Encriptar la contraseña
        const passwordHashed = await bcryptjs.hash(password, 10)

        // 4. Crear el nuevo cliente directamente con el modelo
        // Nota: Asignamos por defecto isActive y isVerified en true si no vienen en el req.body
        const newCustomer = new customerModel({
            name,
            lastname,
            birthdate,
            phone,
            email,
            password: passwordHashed,
            DUI,
            isActive: isActive ?? true,
            isVerified: isVerified ?? true,
            loginAttemps: loginAttemps || 0,
            timeOut
        })

        // 5. Guardar en la base de datos de forma directa
        await newCustomer.save()

        // 6. Responder al cliente que el registro fue exitoso
        return res.status(201).json({ 
            message: "Customer registered successfully",
            customer: {
                id: newCustomer._id,
                name: newCustomer.name,
                email: newCustomer.email
            }
        })

    } catch (error) {
        console.log("error: " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default registerCustomerController