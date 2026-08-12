import * as examController from "./exam.controller.js"
import validate from "../../common/middleware/validate.js"
import validateObjectIds from "../../common/middleware/id_validator.js"
import CreateExamDto from "./dto/createExam.dto.js"
import UpdateExamDto from "./dto/updateExam.dto.js"
import {authenticate, authorize} from "./auth.middleware.js"
import { Router } from "express"

const router = Router();

router.post(
    '/Exam',
    authenticate,
    authorize("teacher"),
    validate(CreateExamDto),
    examController.createExam,
);

router.patch(
    '/exam/:examId',
    authenticate,
    authorize("teacher"),
    validate(UpdateExamDto),
    validateObjectIds("examId"),
    examController.updateExam,
);

router.get(
    '/exam',
    authenticate,
    authorize("teacher"),
    examController.getAllExams,
);

export default router;