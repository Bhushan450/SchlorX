import * as adminController from "./admin.controller.js"
import { Router } from "express"
import TeacherRegisterDto from "./dto/TeacherRegister.dto.js"
import UpdateTeacherDto from "./dto/UpdateTeacher.dto.js"
import validate from "../../common/middleware/validate.js"
import {authenticate, authorize} from "./auth.middleware.js"

const router = Router();

router.post(
    '/teachers',
    authenticate,
    authorize("admin"),
    validate(TeacherRegisterDto),
    adminController.createTeacher
);

router.get(
    '/teacher/:teacherId',
    authenticate ,
    authorize("admin"),
    adminController.getTeacherById
);

router.patch(
    '/teacher/:teacherId' ,
    authenticate, 
    authorize("admin"),
    validate(UpdateTeacherDto), 
    adminController.updateTeacher 
);

router.delete(
    '/teacher/:teacherId' , 
    authenticate,
    authorize("admin"),
    adminController.deleteTeacher
);

router.patch(
    '/teacher/:teacherId/assign-class',
    authenticate,
    authenticate("admin"),
    adminController.assignClassToTeacher
);

export default router;
