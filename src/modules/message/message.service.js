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
        {_id:id, receiver:req.user._id, deletedAt:{$exists:false} } ,
        {},
        { populate: [{ path:"receiver", select :"-password -createdAt -updatedAt -deletedAt -credentialsUpdatedAt -__v" }] }
    ) // {} | null
    if( !message ) {
        throw new Error("Message not found.", {cause:404});
    }

    if(message.receiverId.toString() !== req.user._id.toString()){
        throw new Error("You are not authorized to view this message.", {cause:403});
    }

    // send response
    res.status(200).json({
        message:"Message retrieved successfully.",
        success:true,
        data:message
    })
}

export const getAllMessages = async(req, res, next) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 2;
    const messages = await Message.find(
        {receiverId:req.user._id, deletedAt:{$exists:false} },
        {},
        {limit, skip:(page - 1) * limit, sort:{createdAt:-1}}
    );

    let totalMessages = await Message.countDocuments(
        {receiverId:req.user._id, deletedAt:{$exists:false}});

    let totalPages = Math.ceil(totalMessages / limit);
    res.status(200).json({
        message:"Messages retrieved successfully.",
        success:true,
        data:{
            pagination:{
                currentPage:page,
                limit,
                totalMessages,
                totalPages
            },
            messages
        }
    })
}

export const freezeMessage = async(req, res, next) => {};

export const hardDeleteMessage = async(req, res, next) => {};