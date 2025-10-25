import joi from "joi";
export const isValid = (schema)=>{
    return (req, res, next)=>{
    let data = {...req.body, ...req.params, ...req.query};

    const{error} = schema.validate(data, {abortEarly:false}); //abortEarly: false → Doesn't stop at first error, collects all errors

    if(error) {
        let errMessages = error.details.map(err => err.message)
        console.log(errMessages);//If errors found, collects them into a single string

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
    rePassword:(ref) => joi.string().min(8).valid(joi.ref(ref)),
    objectId:joi.string().hex().length(24)  
}


