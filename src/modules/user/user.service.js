import { User } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import fs from "node:fs";
import cloudinary from "../../utils/cloud/cloudinary.config.js";
export const deleteUser = async (req, res, next)=>{
    if(req.user.profilePictureCloud.public_id){
        await cloudinary.api.delete_resources_by_prefix(`Sara7a-app/Users/${req.user._id}`);
        await cloudinary.api.delete_folder(`Sara7a-app/Users/${req.user._id}`);
    }
    await User.deleteOne({_id:req.user._id})
    // send response
    return res.status(200).json({message:"User deleted successfully!", success:true})
    
}

export const uploadProfile = async(req, res, next)=>{
    if(req.user.profilePicture){
        fs.unlinkSync(req.user.profilePicture); // delete old pic from the server if it exists
    }
    
    const userExist = await User.findByIdAndUpdate(
        req.user._id, 
        {profilePicture:req.file.path}, 
        {new:true});
    // "new:true": means return the updated document
    console.log(req.file);
    if(!userExist){
        throw new Error("User not found!", {cause:404});
    }
    return res.status(200).json({
        message:"Your profile picture is added successfully.",
        success:true,
        data:userExist
    })
}

export const uploadProfileCloud = async (req, res, next)=>{
    const file = req.file;
    const user = req.user;
    await cloudinary.uploader.destroy(user.profilePictureCloud.public_id)
    const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path, 
        {folder:`Sara7a-app/Users/${user._id}/profile-pics`}
    )

    // Update DB
    await User.updateOne({_id:req.user._id},{profilePictureCloud:{secure_url, public_id}})

    return res.status(200).json({
        message:"Profile picture uploaded successfully.",
        success:true,
        data:{secure_url, public_id}
    })
}