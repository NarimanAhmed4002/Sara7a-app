import jwt from "jsonwebtoken";
export const verifyToken = (token, secretKey = "kwke;lrlew;krlm4ektmk4;lmtr")=>{
    return jwt.verify(token, secretKey)
}

export const generateToken = ({
        payload, 
        secretKey = "kwke;lrlew;krlm4ektmk4;lmtr", 
        option={expiresIn:"15m"}
    })=>{
    return jwt.sign(payload, secretKey, option)
    };
    