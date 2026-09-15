import * as classController from "./class.controller.js"
import validate from "../../common/middleware/validate.js"
import validateObjectIds from "../../common/middleware/id_validator.js"
import CreateClassDto from "./dto/classCreate.dto.js"
import UpdateClassDto from "./dto/updateClass.dto.js"
import { authenticate, authorize } from "../auth/auth.middleware.js"
import { Router } from "express"

const router = Router();

router.post(
    '/',
    authenticate,
    authorize("teacher"),
    validate(CreateClassDto),
    classController.createClass
);
router.patch(
    '/:classId',
    authenticate,
    authorize("teacher"),
    validateObjectIds("classId"),
    validate(UpdateClassDto),
    classController.updateClass
);
router.get('/allClaases',
    authenticate,
    authorize("teacher"),
    classController.getAllclasses,
);
router.get('/getClass/:classId',
    authenticate,
    authorize("teacher"),
    validateObjectIds("classId"),
    classController.getClassById
);
router.delete(
    '/deleteClass/:classId',
    authenticate,
    authorize("teacher"),
    validateObjectIds("classId"),
    classController.deleteClass
);

export default router;
