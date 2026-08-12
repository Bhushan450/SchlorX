import * as classController from "./class.controller.js"
import validate from "../../common/middleware/validate.js"
import validateObjectIds from "../../common/middleware/id_validator.js"
import CreateClassDto from "./dto/classCreate.dto.js"
import UpdateClassDto from "./dto/updateClass.dto.js"
import {authenticate, authorize} from "./auth.middleware.js"
import { Router } from "express"

const router = Router();

router.post(
    '/createClass',
    authenticate,
    authorize("teacher"),
    classController.createClass
);
router.patch(
    '/updateClass/:classId', 
    authenticate,
    authorize("teacher"),
    validateObjectIds("classId"),
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
