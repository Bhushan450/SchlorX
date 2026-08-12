import * as studentController from "./student.controller.js"
import CreateStudentDto from "./dto/createStudent.dto.js"
import UpdateStudentDto from "./dto/updateStudent.dto.js"
import validateObjectIds from "../../common/middleware/id_validator.js"
import {authenticate, authorize} from "../auth/auth.middleware.js"
import { Router } from "express"
import validate from "../../common/middleware/validate.js"

const router = Router();

router.post(
    '/Student',
    authenticate,
    authorize("teacher"),
    validate(CreateStudentDto),
    studentController.createStudent
);

router.patch(
    '/Student/:studentId',
    authenticate,
    authorize("teacher"),
    validateObjectIds("studentId"),
    validate(UpdateStudentDto),
    studentController.updateStudent
);

router.get(
    '/allStudents',
    authenticate,
    authorize("teacher"),
    studentController.getAllStudents
);

router.get(
    '/student/:studentId',
    authenticate,
    authorize("teacher"),
    validateObjectIds("studentId"),
    studentController.getStudentById
);

router.delete(
    '/deleteStudents/:studentId',
    authenticate,
    authorize("tecaher"),
    validateObjectIds("studentId"),
    studentController.deleteStudent
);

export default router;