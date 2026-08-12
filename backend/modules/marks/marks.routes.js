import { Router } from "express";
import * as marksController from "./marks.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import validate from "../../common/middlewares/validate.middleware.js";
import validateObjectIds from "../../common/middleware/id_validator.js";
import AddMarksDto from "./dto/addMarks.dto.js";

const router = Router();

// Add / Update marks
router.post(
    "/marks",
    authenticate,
    authorize("teacher"),
    validate(AddMarksDto),
    marksController.addMarks
);

// Get marks of an entire exam
router.get(
    "/marks/exam/:examId",
    authenticate,
    authorize("teacher"),
    validateObjectIds("examId"),
    marksController.getMarksByExam
);

// Get all marks of a particular student
router.get(
    "/marks/student/:studentId",
    authenticate,
    authorize("teacher"),
    validateObjectIds("studentId"),
    marksController.getMarksByStudent
);

export default router;