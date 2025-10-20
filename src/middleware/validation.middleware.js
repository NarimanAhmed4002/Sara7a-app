import joi from "joi";
export const isValid = (schema)=>{
    return (req, res, next)=>{
    const{value, error} = schema.validate(req.body, {abortEarly:false});
    if(error) {
        let errMessages = error.details.map(err => err.message)
        console.log(errMessages);
        errMessages = errMessages.join(", ")
        throw new Error(errMessages, {cause:400});
        }
        next();
    }
    
}

export const generalFields = {
    email:joi.string().email(),
    password:joi.string().min(8),
    otp:joi.string().length(5),
    phoneNumber:joi.string().length(11),
    name:joi.string().min(3).max(50),
    dob:joi.date(),
    rePassword:(ref) => joi.string().min(8).valid(joi.ref(ref))
}


