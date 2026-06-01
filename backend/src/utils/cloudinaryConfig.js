import multer  from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config.js";

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret,
});


//Configuracion de como guardar las imagenes
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "plumasvolando",
        allowed_formats: ["jpg","png","jpeg"]
    }
})

//Configurar multer

const upload = multer({storage})


export default upload;