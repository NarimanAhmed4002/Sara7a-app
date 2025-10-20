import {fileTypeFromBuffer} from "file-type";
import fs from "node:fs";

export const fileValidation = (allowedTypes = ["image/jpeg", "image/png"])=>{
    return async(req, res, next)=>{
        const filePath = req.file.path;
        const buffer = fs.readFileSync(filePath);
        const type = await fileTypeFromBuffer(buffer);
        if(!type || !allowedTypes.includes(type.mime)){
            return new Error("Invalid file format.");
        }
        return next();
    }

}