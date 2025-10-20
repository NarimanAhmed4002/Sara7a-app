import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { generateToken, verifyToken } from "../token/index.js";

export const asyncHandler = (fn) => {
    return (req, res, next) =>{
        fn(req, res, next).catch((error)=>{
            next(error);
        })
    }
}

export const globalErrorHandler = async (err, req, res, next)=>{
        // if(req.file){
        //     fs.unlinkSync(req.file.path); // delete the file from the server if it exists
        // }
        if(err.message === "jwt expired"){
            const refreshToken = req.headers.refreshToken;
            const payload = verifyToken(refreshToken);
            const tokenExist = await Token.findOneAndDelete({
                token:refreshToken,
                user:payload.id,
                type:"refresh"
            })
            if(!tokenExist){
                throw new Error("Invalid refresh token, please login again", {cause:401});
            }
            const token = generateToken({
                payload:{id:payload.id},
                option:{expiresIn:"15m"}
            })

            const newRefreshToken = generateToken({
                payload:{id:payload.id},
                option:{expiresIn:"7d"}
            })

            await Token.create({
                token:newRefreshToken, 
                user:payload.id, 
                type:"refresh"})

            return res.status(200).json({
                message:"New refresh token is created successfully",
                success:true,
                data:{token, refreshToken:newRefreshToken}
            })
        }
        res.status(err.cause || 500).json({
            message:err.message,
            success:false,
            globalErrorHandler:true,
            stack:err.stack
        });
    } 
