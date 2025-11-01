import { model, Schema } from "mongoose";

const schema = new Schema({
    jti:{
        type:String,
        required:true,
        unique:true
    },
    expiresIn:{
        type:Number,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:["access","refresh"],
        default:"access"
    }
},{timestamps:true})

export const Token = model("Token", schema)