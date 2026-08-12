import * as teacherController from "./admin.controller.js"
import { Router } from "express"
import TeacherRegisterDto from "./dto/TeacherRegister.dto.js"
import UpdateTeacherDto from "./dto/UpdateTeacher.dto.js"
import UpdatePasswordDto from "./dto/updatePassword.dto.js"
import validate from "../../common/middleware/validate.js"
import validateObjectIds from "../../common/middleware/id_validator.js"
import {authenticate, authorize} from "../auth/auth.middleware.js"

const router = Router();    

router.get(
    '/teacher/:teacherId',
    authenticate ,
    authorize("admin"),
    validateObjectIds("teacherId"),
    teacherController.getTeacherById
);

router.patch(
    '/teacher/:teacherId' ,
    authenticate, 
    authorize("teacher"),
    validateObjectIds("teacherId"),
    validate(UpdateTeacherDto), 
    teacherController.updateTeacher 
);

router.patch(
    '/updatePassword' ,
    authenticate, 
    authorize("teacher"),
    validateObjectIds("teacherId"),
    validate(UpdatePasswordDto), 
    teacherController.changePassword 
);


router.delete(
    '/teacher/:teacherId' , 
    authenticate,
    authorize("admin"),
    validateObjectIds("teacherId"),
    teacherController.deleteTeacher
);

export default router;
