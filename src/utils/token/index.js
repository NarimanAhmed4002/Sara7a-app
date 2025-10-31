import jwt from "jsonwebtoken";
export const verifyToken = ({token, signature ,secretKey = "kwke;lrlew;krlm4ektmk4;lmtr"})=>{
    return jwt.verify(token, secretKey, signature)
}

export const generateToken = ({
        payload, 
        signature ,
        secretKey = "kwke;lrlew;krlm4ektmk4;lmtr", 
        option={expiresIn:"15m"}
    })=>{
    return jwt.sign(payload, secretKey, option, signature)
    };
    