import { User } from "../../DB/models/user.model.js";
import fs from "node:fs";
import cloudinary, { uploadFile } from "../../utils/cloud/cloudinary.config.js";
import { comparePassword, hashPassword } from "../../utils/hash/index.js";
export const deleteUser = async (req, res, next)=>{
    await User.updateOne(
        {_id:req.user._id}, 
        {deletedAt:Date.now(), credentialsUpdatedAt:Date.now()});
    // delete token
    await Token.deleteMany({user:req.user._id});
    // send response
    return res.status(200)
        .json({
        message:"User deleted successfully!", 
        success:true
    })
    
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
    const {secure_url, public_id} = await uploadFile({
        path:file.path,
        options: uploadOptions
    })

    // Update DB
    await User.updateOne({_id:req.user._id},{profilePictureCloud:{secure_url, public_id}})

    return res.status(200).json({
        message:"Profile picture uploaded successfully.",
        success:true,
        data:{secure_url, public_id}
    })
}

export const getProfile = async (req, res, next) => {
    const user = await User.findOne(
        {_id: req.user._id},
        {},
        { populate:[{ path: "messages", populate:[{ path: "receiver", select:"-password"}] }] }
    );
    return res.status(200).json({
        message: "User profile successfully.",
        success: true,
        data: user
    })
};

export const updatePassword = async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;
    const comparedPassword = comparePassword(oldPassword, req.user.password);
    if(!comparedPassword){
        throw new Error("Invalid password!", {cause:404 });
    };
    if(oldPassword === newPassword){
        throw new Error("New password must be different from old password!", {cause:400});
    };
    await User.updateOne({_id:req.user._id},{password:hashPassword(newPassword), credentialsUpdatedAt:Date.now()});
    return res.status(200).json({
        message:"Password updated successfully.",
        success:true
    });
}