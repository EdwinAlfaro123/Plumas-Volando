import jsonwebtoken from "jsonwebtoken" //Token
import bcryptjs from "bcryptjs" //Encriptar contraseña
import {config} from "../../config.js" 
import customerModel from "../model/Customers.js"
import { json } from "express"

//Arra yde funciones
const loginCustomerController = {}

loginCustomerController.login = async (req, res) => {
    try {
        //Solicitar datos
        const {email, password} = req.body

        //Verificar si el correo existe en la base de datos
        const customerFound = await customerModel.findOne({email})

        //Si no existe el correo
        if(!customerFound){
            return res.status(400).json({message: "Customer not found"})
        }
        
        //Verificamos que la cuenta no este bloqueada
        if(customerFound.timeOut && customerFound.timeOut > Date.now()){
            return res.status(403).json({message: "Blocked account"})
        }

        //Validar la contraseña
        const isMatch = await bcryptjs.compare(password, customerFound.password)

        //Si la contraseña esta incorrecta
        if(!isMatch){
            //Sumar 1 a la cantidad de intentos fallidos
            customerFound.loginAttemps = (customerFound.loginAttemps || 0) + 1

            if(customerFound.loginAttemps >= 5){
                customerFound.timeOut = Date.now() + 5 * 60 * 1000
                customerFound.loginAttemps = 0

                await customerFound.save()

                return res.status(400).json({message: "Blocked account for many attemps"})
            }

            await customerFound.save()

            return res.status(401).json({message: "Wrong password"})
        }

        //Reseteamos intentos si el login es correcto
        customerFound.loginAttemps = 0
        customerFound.timeOut = null

        //Generar el token
        const token = jsonwebtoken.sign(
            //que vamos a guardar
            {id: customerFound._id, userType: "customer"},
            //secret key
            config.JWT.secret,
            //Cuando expira
            {expiresIn: "30d"}
        )

        //El toktn lo guardamos en euna cookie
        res.cookie("authCookie", token)

        return res.status(200).json({message: "Login successfully"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server error"})
    }
}

export default loginCustomerController