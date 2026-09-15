import TeacherRequest from "./teacherRequest.model.js";
import User from "../auth/auth.model.js"
import ApiError from "../../common/utils/ApiError.js";


// generate a request
const createTeacherRequest = async (userId) => {

    if (!userId) throw ApiError.badRequest("userId is required");

    const existingUser = await User.findById(userId);
    if (!existingUser) throw ApiError.notFound("User not exits");

    if (existingUser.role === "teacher") throw ApiError.conflict("User is already a teacher");

    const existingRequest = await TeacherRequest.findOne({
        userId,
        status: "pending",
    });
    if (existingRequest) throw ApiError.conflict("Teacher request is already pending")

    const generateRequest = await TeacherRequest.create({
        userId,
    });

    return generateRequest;
};

// get all teachersRequests
const getAllRequests = async () => {

    // find -> never returns null , it returns [] , so we need to check length
    const allRequests = await TeacherRequest.find({ status: "pending" }).populate("userId", "name email phone");
    if (allRequests.length === 0) throw ApiError.notFound("No pending requests");

    return allRequests;
};

// get requestById
const getRequestById = async (requestId) => {

    if (!requestId) throw ApiError.badRequest("UserId is required");

    const getRequestbyId = await TeacherRequest.findOne({
        userId: requestId,
        status: "pending",
    }).populate("userId", "name email phone")

    if (!getRequestbyId) throw ApiError.notFound("No pending request");

    return getRequestbyId;

};

//approves teacherRequest 
const approveRequest = async (requestId) => {

    if (!requestId) throw ApiError.badRequest("requestId is required");

    const request = await TeacherRequest.findById(requestId);
    if (!request) throw ApiError.notFound("No request found")

    if (request.status !== "pending") {
        throw ApiError.conflict("Teacher request has already been handled")
    }

    const user = await User.findById(request.userId);
    if (!user) throw ApiError.notFound("No user found");

    user.role = "teacher";

    request.status = "approved";
    request.reviewedAt = new Date();

    await user.save();
    await request.save();

    return {
        message: "request is handled- approved!"
    }
}

// Get all approved and rejected teacher requests
const getProcessedRequests = async () => {

    const requests = await TeacherRequest.find({
        status: { $in: ["approved", "rejected"] }
    })
        .populate("userId", "name email phone role")
        .sort({ reviewedAt: -1 });

    return requests.filter(request => request.userId !== null);
};

// reject teacherRequest
const rejectRequest = async (requestId) => {
    if (!requestId) throw ApiError.badRequest("RequestId is required");

    const request = await TeacherRequest.findById(requestId);
    if (!request) throw ApiError.notFound("No request found");

    if (request.status !== "pending") {
        throw ApiError.conflict("Teacher request has already been handled");
    }

    request.status = "rejected";
    request.reviewedAt = new Date();

    await request.save();

    return {
        message: "request is handled - rejected!",
    }
}

export {
    createTeacherRequest,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    getProcessedRequests
}