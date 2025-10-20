// naming convention for routers is kabab case
import { Router } from "express";
import * as authService from "./auth.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { registerSchema, resetPassword } from "./auth.validation.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";

const router = Router();
router.post("/register", isValid(registerSchema), authService.register)
router.post("/login", authService.login)
router.post("/verify-account", authService.verifyAccount)
router.post("/send-otp", authService.sendOTP)
router.post("/google-login", authService.googleLogin)
router.patch("/reset-password",isValid(resetPassword), authService.resetPassword)
router.post("/logout", isAuthenticated, authService.logOut)
export default router