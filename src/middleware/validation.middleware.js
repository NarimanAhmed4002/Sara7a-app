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
    password:joi.string().min(8).max(50),
    otp:joi.string().length(5),
    phoneNumber:joi.string().length(11),
    name:joi.string().min(3).max(50),
    dob:joi.date(),
    confirmPassword:(ref) => joi.string().min(8).max(50).valid(joi.ref(ref)),
    objectId:joi.string().hex().length(24),
    headers:joi.object().keys({
        authorization:joi.string().required().messages({
            "string.empty":"token is required!",
            "any.required":"token is required!"
        }),
        accept:joi.string(),
        host:joi.string(),
        "accept-encoding":joi.string(),
        "content-type":joi.string(),
        "user-agent":joi.string(),
        "cashe-control":joi.string(),
        "postman-token":joi.string(),
        "content-length":joi.string(),
        connection:joi.string(),
    })  
}


