import { v2 as cloudinary } from "cloudinary";
// we cannot export here before config because we need to config first
// config : is used to connect between BE and cloudinary    
cloudinary.config({
    api_key:process.env.API_KEY , // username
    api_secret:process.env.API_SECRET, // password
    cloud_name:process.env.CLOUD_NAME // database name
})

export async function uploadFile (path, options){
    return await cloudinary.uploader.upload(path, options);
}

export async function uploadFiles ({files, options}) {
     let attachments = [];
    for (const file of files) {
        const { secure_url, public_id } = await uploadFile(
            {path: file.path,
            options,
        });
        attachments.push({url:secure_url, public_id});
    }
    return attachments;
}
export async function deleteFolder(path){
    await cloudinary.api.delete_resources_by_prefix(path);
    await cloudinary.api.delete_folder(path);
    
}
export default cloudinary; 