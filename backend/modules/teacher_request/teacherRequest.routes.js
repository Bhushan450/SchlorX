import express from "express";
import * as teacherRequestController from "./teacherRequest.controller.js";
import authenticate from "../../common/middleware/authenticate.js";
import authorize from "../../common/middleware/authorize.js";
import validateObjectIds from "../../common/middleware/id_validator.js";

const router = express.Router();

// ===================== USER ROUTES =====================

// Send teacher request
router.post(
    "/teacherRequest",
    authenticate,
    authorize("user"),
    teacherRequestController.createTeacherRequest
);

// ===================== ADMIN ROUTES =====================

// Get all pending teacher requests
router.get(
    "/teacherRequest",
    authenticate,
    authorize("admin"),
    teacherRequestController.getAllRequests
);

// Get a specific teacher request
router.get(
    "teacherRequest/:requestId",
    authenticate,
    authorize("admin"),
    validateObjectIds("requestId"),
    teacherRequestController.getRequestById
);

// Approve teacher request
router.patch(
    "teacherRequest/:requestId/approve",
    authenticate,
    authorize("admin"),
    validateObjectIds("requestId"),
    teacherRequestController.approveRequest
);

// Reject teacher request
router.patch(
    "teacherRequest/:requestId/reject",
    authenticate,
    authorize("admin"),
    validateObjectIds("requestId"),
    teacherRequestController.rejectRequest
);

export default router;