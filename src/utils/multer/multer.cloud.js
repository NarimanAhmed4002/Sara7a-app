import multer, { diskStorage } from "multer";

export function fileUpload({ allowedTypes = ["image/png", "image/jpeg"]} = {}) {
    const storage = diskStorage({});
    const fileFilter = (req, file, cb)=>{
        if(allowedTypes.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error("Invalid file format.", {cause: 400}), false /**momken mktbsh false 3ady */)
        }
    }
    return multer({ fileFilter, storage }); // storage arg. is the execution of diskStorage (Its callback) 
}

fileUpload() // >> object
