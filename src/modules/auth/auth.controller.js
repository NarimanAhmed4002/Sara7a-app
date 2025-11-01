// naming convention for routers is kabab case
import { Router } from "express";
import * as authService from "./auth.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { registerSchema, resetPassword, sendOtpSchema, verifyAccountSchema } from "./auth.validation.js";
import { isAuthenticated, tokenTypes } from "../../middleware/auth.middleware.js";

const router = Router();
router.post("/register", isValid(registerSchema), authService.register)
router.post("/login", authService.login)
router.post("/verify-account",isValid(verifyAccountSchema), authService.verifyAccount)
router.post("/send-otp", isValid(sendOtpSchema),authService.sendOTP)
router.post("/google-login", authService.googleLogin)
router.patch("/reset-password",isValid(resetPassword), authService.resetPassword)
router.post("/logout", isAuthenticated(), authService.logOut)
router.post("/refresh-token", isAuthenticated(tokenTypes.refresh),authService.refreshToken)
export default router