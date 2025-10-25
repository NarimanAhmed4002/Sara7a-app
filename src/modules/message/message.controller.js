import { Router } from "express";
import { fileUpload } from "../../utils/multer/index.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";
import { sendMessage } from "./message.service.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router()
// sarah.com/message/2345654321234567890
// anonymous sender
router.post("/:receiver", 
    fileUpload().array("attachments", 2), 
    isValid(sendMessageSchema),
    sendMessage)

// known sender
router.post("/:receiver/sender", 
    isAuthenticated,
    fileUpload().array("attachments", 2), 
    isValid(sendMessageSchema),
    sendMessage
)
export default router 