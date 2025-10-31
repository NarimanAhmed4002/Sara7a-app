import bycrypt from "bcrypt";
export const hashPassword = (password)=>{
    return bycrypt.hashSync(password, process.env.SALTORROUNDS);
}

export const comparePassword = (password, hashPassword)=>{
    return bycrypt.compareSync(password, hashPassword);
}