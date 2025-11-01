import { model, Schema } from "mongoose";

const schema = new Schema({
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String,
        minlength:[2, "Minimum message length is 2 characters."],
        maxlength:[ 7000, "Maximum message length is 7000 characters."],
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
    },
    deletedAt: Date,
},{timestamps:true});

// export message model
export const Message = model("Message", schema)