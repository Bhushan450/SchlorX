import * as authController from "./auth.controller.js"
import { Router } from "express"
import LoginDto from "./dto/login.dto.js"
import RegisterDto from "./dto/register.dto.js"
import ForgotPasswordDto from "./dto/forgotPassword.dto.js"
import ResetPasswordDto from "./dto/forgotPassword.dto.js"
import validate from "../../common/middleware/validate.js"
import {authenticate, authorize} from "./auth.middleware.js"

const router = Router();

router.post('/register', authenticate,validate(RegisterDto), authController.register )
router.post('/login', validate(LoginDto) , authController.login )
router.post('/logout', authenticate, authController.logout )
router.post('/refresh-tokens', authController.refresh )
router.post('/forgot-password', validate(ForgotPasswordDto) , authController.forgotPassword )
router.post('/reset-password', validate(ResetPasswordDto) , authController.resetPassword )
router.get('/getMe',authenticate , authController.getProfile )

export default router;
