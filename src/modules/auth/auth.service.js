import { User } from "../../DB/models/user.model.js";
import { sendMail } from "../../utils/email/index.js";
import { generateOTP } from "../../utils/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../../utils/hash/index.js";
import { Token } from "../../DB/models/token.model.js";
import { generateToken } from "../../utils/token/index.js";

export const register = async (req, res, next)=>{
    const {fullName, email, password, phoneNumber, dob} = req.body;
    // validate data
    
    const userExistence = await User.findOne({
            $or:[
                { $and:[
                    { email:{$ne:null} }, 
                    { email:{$exists:true} }, 
                    {email:email}
                ]},
                { $and:[
                    { phoneNumber:{$ne:null }},
                    { phoneNumber:{$exists:true} }, 
                    {phoneNumber:phoneNumber}
                ]}
            ]
        });
        if (userExistence) {
            throw new Error("User already exists!", {cause:409/**conflict */});
        }

        const user = new User({
            fullName,
            email,
            password:hashPassword(password),
            phoneNumber,
            dob
        }); 

        // otp >> one time password
        const {otp, otpExpire} = generateOTP()
        user.otp = otp;
        user.otpExpire = otpExpire;

        if(email) {await sendMail({
            to:email, 
            subject:"Verify your account",
            html:`<p>Your code is ${otp}.</p>`
        })}

        // const [firstName, lastName] = fullName.split(" ");
        // const user = new User({firstName,lastName,email,password:bycrypt.hashSync(password, 10),phoneNumber,dob});
        await user.save();

        return res.status(201).json({message:"User created Successfully!", success:true})
}

export const verifyAccount = async (req, res, next)=>{
    // destruct otp from body
        const {otp, email} = req.body;
        // check user’s email , otp & time
        const userExist = await User.findOne({
            email,
            otp,
            otpExpire:{$gt:Date.now()}
        })
        // check if email user entered is correct, otp & otp time
        if(!userExist) {
            throw new Error("Invalid code!");
        }
        // update user in BE (RAM)
        userExist.isVerified = true
        userExist.otp = undefined
        userExist.otpExpire = undefined
        // save the updates in DB
        await userExist.save();
        // send response
        return res.status(200)
        .json({
            message:"Account is verified successfully!",
            success:true,
        })
}

export const sendOTP = async (req, res, next)=>{
    // get data from req
    const {email} = req.body;
    // new otp
    const {otp, otpExpire} = generateOTP(5*60*1000)
    // update user
    const userExist = await User.findOneAndUpdate({email}, {otp, otpExpire});
    if(!userExist){
        throw new Error("User not found!", {cause:404});
    }
    // send email
    await sendMail({
        to:email,
        subject:"Send code",
        html:`<p>Your code to verify your account is ${otp}.</p>`
    })
    // send response
    return res.status(200).json({
        message:"Your code is sent successfully!",
        success:true
    })
    
}

export const login = async (req, res, next) =>{
    // destruct email, phoneNumber & password from body
        const {email, phoneNumber, password} = req.body;
        const userExist = await User.findOne({
            $or:[{
                $and:[
                    {email:{$exists:true}},
                    {email:{$ne:null}},
                    {email:email}
                ]},
                {$and:[
                    {phoneNumber:{$exists:true}},
                    {phoneNumber:{$ne:null}},
                    {phoneNumber:phoneNumber}
                ]}
            ]
        });

        //console.log(userExist);
        
        if(!userExist){
            throw new Error("Invalid credentials!", {cause:401}); // Email is not correct
        }

        const match = comparePassword(password, userExist.password);// ليه هنا قارنت الباسورد بالباسورد اللي في ال userExist وانا اساسا في ال userExist  كنت بجيب ايميل و فون نامبر و بس
        // bec findOne return obj for all data of user with this email or this password 
        if(!match) {
            throw new Error("Invalid credentials!", {cause:401});// paswword is not correct
        }

        // check if user is deleted
        if(userExist.deletedAt){
            userExist.deletedAt = undefined;
            await userExist.save();
        }

        const accessToken = generateToken({
            payload:{id:userExist._id},
            option:{expiresIn:"1d"}
        })

        const refreshToken = generateToken({
            payload:{id:userExist._id},
            option:{expiresIn:"7d"}
        })

        await Token.create({token:refreshToken, user:userExist._id})
        return res.status(200).json(
            {message:"User logged in successfully!", 
                success:true, 
                data:{accessToken,refreshToken}})
}

export const googleLogin = async (req, res, next) => {
    // get data from body
    const {idToken} = req.body;
    // verify token
    const client = new OAuth2Client(
        "730997208287-fci9admv25n84janj2lgmbkmtctm3ugr.apps.googleusercontent.com");
    const ticket = await client.verifyIdToken({idToken});
    const payload = ticket.getPayload()
    let userExist = await User.findOne({email:payload.email})
    // create user
    if(!userExist) {
            userExist = User.create({
            fullName:payload.name,
            email:payload.email,
            phoneNumber:payload.phone,
            dob:payload.Birthdate,
            isVerified:true,
            userAgent:"google"
        })    
    }
    // create token
    const token = jwt.sign(
        {id:userExist._id, name:userExist.fullName},
        "kwke;lrlew;krlm4ektmk4;lmtr", 
        {expiresin:"15m"})
    // send response
    return res.status(200).json({
        message:"Logged in successfully!",
        success:true,
        data:{token}
    })
}

export const resetPassword = async (req, res, next)=>{
    const {email, otp, newPassword} = req.body;
    // check user existence
    const userExist = await User.findOne({email});
    if(!userExist){
        throw new Error("User not found!", {cause:404});
    }
    // check OTP
    if(userExist.otp!== otp){
        throw new Error("Invalid code!", {cause:400});
    }
    // check OTP expire time
    if(userExist.otpExpire < Date.now()){
        throw new Error("Your code is expired!", {cause:400});
    }
    // update password
    userExist.password = hashPassword(newPassword)
    userExist.credentialsUpdatedAt = Date.now();
    userExist.otp = undefined;
    userExist.otpExpire = undefined;  
    // update DB
    await userExist.save();
    // destroy all refresh tokens
    await Token.deleteMany({user:userExist._id, type:"refresh"});
    // send response
    return res.status(200).json({
        message:"Password updated successfully.",
        success:true
    })
}

export const logOut = async (req, res, next) => {
    // get token from headers
    const token = req.headers.authorization;
    // create token in DB
    await Token.create({token, user:req.user._id})
    // send response
    return res.status(200).json({
        message:"Logged out successfully!",
        success:true
    })
}