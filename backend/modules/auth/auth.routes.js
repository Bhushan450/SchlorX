import * as authController from "./auth.controller.js"
import { Router } from "express"
import LoginDto from "./dto/login.dto.js"
import RegisterDto from "./dto/register.dto.js"
import ForgotPasswordDto from "./dto/forgotPassword.dto.js"
import ResetPasswordDto from "./dto/resetPassword.dto.js"
import validate from "../../common/middleware/validate.js"
import { authenticate, authorize } from "./auth.middleware.js"

const authRoute = Router();

authRoute.post('/register', validate(RegisterDto), authController.register)
authRoute.post('/login', validate(LoginDto), authController.login)
authRoute.post('/logout', authenticate, authController.logout)
authRoute.post('/refresh-tokens', authController.refresh)
authRoute.post('/forgot-password', validate(ForgotPasswordDto), authController.forgotPassword)
authRoute.post('/reset-password/:token', validate(ResetPasswordDto), authController.resetPassword)
authRoute.get('/verify-email/:token', authController.verifyEmail)
authRoute.get('/getMe', authenticate, authController.getProfile)

export default authRoute;
