import { Token } from "../DB/models/token.model.js";
import { User } from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/index.js";

export const isAuthenticated = async(req, res, next)=>{
    // get token from req
    const token = req.headers.authorization;
    if(!token){
        throw new Error("Token is required.", {cause:401});
    }
    
    // verify token signature
    const payload = verifyToken(token) // verify throw error automatically
    // check token in DB
    const blockedToken = await Token.findOne({token, type:"access"})
    if(blockedToken){
        throw new Error("Token is invalid.", {cause:401});
    };
    // check user existence in DB
    const userExist = await User.findById(payload.id)
    if(!userExist){
        throw new Error("User is not find",{cause:404});
    };

    // date take time in milli seconds & iat is in seconds
    if(userExist.credentialsUpdatedAt > new Date (payload.iat * 1000)) {
        throw new Error("Token is expired!", {cause:401});
    }

    req.user = userExist;
    
    return next();

}