import express from "express";
import * as teacherRequestController from "./teacherRequest.controller.js";
import { authenticate, authorize } from "../auth/auth.middleware.js";
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
    "/",
    authenticate,
    authorize("admin"),
    teacherRequestController.getAllRequests
);

// get all users(approved & rejected)
router.get(
    "/processed",
    authenticate,
    authorize("admin"),
    teacherRequestController.getProcessedRequests
);

// Get a specific teacher request
router.get(
    "/:requestId",
    authenticate,
    authorize("admin"),
    validateObjectIds("requestId"),
    teacherRequestController.getRequestById
);

// Approve teacher request
router.patch(
    "/:requestId/approve",
    authenticate,
    authorize("admin"),
    validateObjectIds("requestId"),
    teacherRequestController.approveRequest
);

// Reject teacher request
router.patch(
    "/:requestId/reject",
    authenticate,
    authorize("admin"),
    validateObjectIds("requestId"),
    teacherRequestController.rejectRequest
);

export default router;