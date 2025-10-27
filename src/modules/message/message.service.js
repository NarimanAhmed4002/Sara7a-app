import { uploadFile } from "../../utils/cloud/cloudinary.config.js"
import { Message } from "../../DB/models/message.model.js";
export const sendMessage = async(req, res, next) => {
    // get data from req
    const {content} = req.body;
    const {receiver} = req.params;
    const {files} = req; // fileUpload.array : inject files in req >> array of object >> each obj has file info : path, org name, mime type,...
    // upload into cloud
    const attachments = await uploadFile({
        files,
        options:{folder:`saraha-app/users/${receiver}/messages`}
    })
   // create message >> save in db>> connect sender receiver attachments
    await Message.create({
        content,
        attachments,
        receiver,
        sender: req.user?._id // if req has user, get its id else it is undefined >> anonymous >> no sender in DB
    })
    // send response 
    res.status(201).json({
        message:"Message sent successfully.",
        success:true
    })
} 

export const getMessage = async(req, res, next) => {
    // get data from req
    const {id} = req.params;

    // get specific message 
    const message = await Message.findOne(
        {_id:id, receiver:req.user._id},
        {},
        { populate: [{ path:"receiver", select :"-password -createdAt -updatedAt -deletedAt -credentialsUpdatedAt -__v" }] }
    ) // {} | null
    if( !message ) {
        throw new Error("Message not found.", {cause:404});
    }

    // send response
    res.status(200).json({
        message:"Message retrieved successfully.",
        success:true,
        data:message
    })
}