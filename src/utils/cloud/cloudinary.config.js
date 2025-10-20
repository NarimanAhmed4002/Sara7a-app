import { v2 as cloudinary } from "cloudinary";
// we cannot export here before config because we need to config first
// config : is used to connect between BE and cloudinary    
cloudinary.config({
    api_key:process.env.API_KEY , // username
    api_secret:process.env.API_SECRET, // password
    cloud_name:process.env.CLOUD_NAME // database name
})

export default cloudinary; 