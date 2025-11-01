import { model, Schema } from "mongoose";
import { type } from "node:os";
const schema = new Schema({
    firstName:{
        type: String,
        trim:true,
        required:true,
        lowercase:true // kolo lower case
    },
    lastName:{
        type: String,
        trim:true,
        required:true,
        lowercase:true 
    },
    email:{type: String,
        trim:true,
        required:function(){
            if (this.phoneNumber) {
                return false;
            }
            return true;
        }, 
        // unique:true
    },
    // userAgent:{
    //     type:String,
    //     enum:["local", "google"],
    //     default:"local"
    // },
    password:{
        type: String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:function(){
            if (this.email) {
                return false;
            }
            return true;
        },
        // unique:true
    },
    dob:{
        type: Date
    },
    otp:{
        type:Number
    },
    hashOTP:{
        type:String
    },
    otpExpire:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    // local
    profilePicture:{
        type:String
    },
    // cloud
    profilePictureCloud:{
        secure_url:String,
        public_id:String
    },
    credentialsUpdatedAt:{
        type:Date,
        default:Date.now() // register / reset password
    },
    deletedAt:{
        type:Date
    },
    otpBlockUntil:Date,
    otpAttempts:{
        type:Number,
        default:0
    },

},{timestamps: true, toObject:{ virtuals:true }, toJSON:{ virtuals:true }});

export const User = model("User", schema)

schema.virtual("fullName").get(function(){
    return `${this.firstName} ${this.lastName}`
})

schema.virtual("fullName").set(function (value) {
    const [firstName, lastName] = value.split(" "); // square brackets[] not curly brackets{}
    this.firstName = firstName;
    this.lastName = lastName;
})

schema.virtual("Age").get(function (){
    return new Date().getFullYear() - new Date(this.dob).getFullYear();
})

schema.virtual("messages", {
    ref: "Message",
    localField: "_id",
    foreignField: "receiver"
})