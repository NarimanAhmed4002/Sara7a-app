import bycrypt from "bcrypt";
export const hashPassword = (password)=>{
    return bycrypt.hashSync(password, 10);
}

export const comparePassword = (password, hashPassword)=>{
    return bycrypt.compareSync(password, hashPassword);
}