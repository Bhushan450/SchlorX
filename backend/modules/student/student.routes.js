import * as studentController from "./student.controller.js"
import CreateStudentDto from "./dto/createStudent.dto.js"
import UpdateStudentDto from "./dto/updateStudent.dto.js"
import validateObjectIds from "../../common/middleware/id_validator.js"
import { authenticate, authorize } from "../auth/auth.middleware.js"
import { Router } from "express"
import validate from "../../common/middleware/validate.js"

const router = Router();

router.post(
    '/',
    authenticate,
    authorize("teacher"),
    validate(CreateStudentDto),
    studentController.createStudent
);

router.patch(
    '/:studentId',
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
    '/:studentId',
    authenticate,
    authorize("teacher"),
    validateObjectIds("studentId"),
    studentController.getStudentById
);

router.delete(
    '/:studentId',
    authenticate,
    authorize("teacher"),
    validateObjectIds("studentId"),
    studentController.deleteStudent
);

export default router;