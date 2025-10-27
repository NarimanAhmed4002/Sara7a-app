import { Router } from "express";
import * as userService from "./user.service.js"
import { fileUpload } from "../../utils/multer/multer.local.js";
import { fileUpload as fileUploadCloud} from "../../utils/multer/multer.cloud.js";
import { fileValidation } from "../../middleware/file-validation-middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();
router.delete("/delete",isAuthenticated, userService.deleteUser)
router.post("/upload-profile", 
    isAuthenticated, //  it is a middleware ,so it is wrote without ()
    fileUpload({folder:"profilesPic"}).single("profilePicture"), // 
    fileValidation(), // its execution returns a middleware function, so it must be called
    userService.uploadProfile) 
//router.post("/upload-cv", fileUpload(["application/pdf", "application/msword"]).single("CV"), userService.uploadCV) 
// ^ fileUpload() returns an object, but with method "single" that takes the field name as an argument and returns a middleware function

router.post("/uploud-profile-cloud",
    isAuthenticated,
    fileUploadCloud().single("profilePicture"),
    fileValidation(),
    userService.uploadProfileCloud

)

router.get("/",isAuthenticated, userService.getProfile)
export default router