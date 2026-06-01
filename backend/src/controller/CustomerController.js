const CustomerController = {}


import customerModel from "../model/Customers.js"


CustomerController.getCustomers = async (req,res) => {
    try {
        const customers = await customerModel.find()
        return res.status(200).json(customers)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}


CustomerController.putCustomer = async (req,res) => {
    try {
        let {
            name,
            lastname,
            birthdate,
            phone,
            email,
            DUI,
            isVerified
        } = req.body

        name = name?.trim()
        email = email?.trim()
        lastname = lastname?.trim()
        
        if(!name || !email || !lastname || !DUI){
            return res.status(400).json({message: "Fields required"})
        }

        if(name.length < 3 || name.length > 15){
            return res.status(400).json({message: "Please insert a valid name"})
        }

        //actualizamos en la base de datos 
        const putCustomers = await customerModel.findByIdAndUpdate(req.params.id,{
            name,
            lastname,
            birthdate,
            phone,
            email,
            DUI,
            isVerified
        })        

        if(!putCustomers) {
            return res.status(404).json({message: "Customer not found"})
        }

        return res.status(200).json({message: "Customer updated"})
         

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

CustomerController.deleteCustomer = async(req, res) => {
    try {
        const deleteCustomer = customerModel.findByIdAndDelete(req.params.id)

        if(!deleteCustomer){
            return res.status(404).json({message: "Customer not found"})
        }

        return res.status(200).json({message: "Customer deleted"})

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}



export default CustomerController;