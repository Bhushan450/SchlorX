import * as authController from "./auth.controller.js"
import { Router } from "express"
import LoginDto from "./dto/login.dto.js"
import RegisterDto from "./dto/register.dto.js"
import forgotPasswordDto from "./dto/forgotPassword.dto.js"
import resetPasswordToken from "./dto/forgotPassword.dto.js"
import validateData from "../../common/middleware/validate.js"
import {authenticate, authorize} from "./auth.middleware.js"

const router = Router();

router.post('/register', authenticate, authorize("admin"),validate(RegisterDto), authController.register )
router.post('/login', validate(LoginDto) , authController.login )
router.post('/logout', authenticate, authController.logout )
router.post('/refresh-tokens/:token', authController.refresh )
router.post('/forgot-password', validate(forgotPasswordDto) , authController.forgotPassword )
router.post('/reset-password', validate(ResetPasswordDto) , authController.resetPassword )
router.get('/getMe',authenticate , authController.getProfile )

export default router;
