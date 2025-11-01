import bycrypt from "bcrypt";
export const generateHash = (otp)=>{
    return bycrypt.hashSync(otp, process.env.SALTORROUNDS);
}