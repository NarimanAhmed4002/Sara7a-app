import fs from "fs";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
export function fileUpload({folder, allowedTypes = ["image/png", "image/jpeg"]} = {}) {
    const storage = diskStorage({
    destination: (req, file, cb )=>{
        let dest = `uploads/${req.user._id}/${folder}`;
        if(!fs.existsSync(dest))
            { fs.mkdirSync(dest, {recursive:true});
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        //console.log({ file });
        cb (null, nanoid(5) + "_" + file.originalname); // cb() = next()
    },
});

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
