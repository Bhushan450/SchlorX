import * as attendenceController from "./attendence.controller.js"
import Attendence from "./attendence.model.js"
import AttendenceDto from "./dto/Attendence.dto.js"
import validate from "../../common/middleware/validate.js"
import validateObjectIds from "../../common/middleware/id_validator.js"
import {authenticate, authorize} from "../auth/auth.middleware.js"
import { Router } from "express"
import router from "../student/student.routes.js"

const router = Router();

// Mark attendance for the teacher's assigned class
router.post(
    "/",
    authenticate,
    authorize("teacher"),
    validateObjectIds("classId"),
    validate(AttendenceDto),
    attendanceController.attendance
);

// Get attendance of the teacher's class for a particular date
router.get(
    "/date",
    authenticate,
    authorize("teacher"),
    validateObjectIds("classId"),
    attendanceController.getAttendanceByDate
);

// Get attendance history of a particular student
router.get(
    "/student/:studentId",
    authenticate,
    authorize("teacher"),
    validateObjectIds("studentId","classId"),
    attendanceController.getAttendanceByStudent
);

