import { Schema } from "mongoose";

const schema = new Schema({
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String,
        minlength:3,
        maxlength:5000,
        required:function(){
            if(this.attachments.length > 0) return false;
            return true;
        }
    },
    attachments:[{
        secure_url:String,
        public_id:String
    }],
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true});

// export message model
export const Message = model("Message", schema)