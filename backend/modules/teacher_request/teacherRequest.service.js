import teacherRequestModel from "./teacherRequest.model.js";
import User from "../auth/auth.model.js"
import ApiError from "../../common/utils/ApiError.js";


// generate a request
const createTeacherRequest = async (userId)=>{

    if(!userId) throw ApiError.badRequest("userId is required");

   const existingUser = await User.findById(userId);
   if(!existingUser) throw ApiError.notFound("User not exits");

   if(existingUser.role ==="teacher") throw ApiError.conflict("User is already a teacher");

   const existingRequest = await teacherRequestModel.findOne({
    userId,
    status:"pending",
   });
   if(existingRequest) throw ApiError.conflict("Teacher request is already pending")

    const generateRequest = await teacherRequestModel.create({
        userId,
    }); 

    return generateRequest;
};

// get all teachersRequests
const getAllRequests = async ()=>{

    // find -> never returns null , it returns [] , so we need to check length
    const allRequests = await teacherRequestModel.find({status:"pending"}).populate("userId","name email phone");
    if(allRequests.length===0) throw ApiError.notFound("No pending requests");

    return allRequests;
};

// get requestById
const getRequestById = async (userId)=>{

    if(!userId) throw ApiError.badRequest("UserId is required");

    const getRequestbyId = await teacherRequestModel.findOne({
        userId:userId,
        status:"pending",
    }).populate("userId","name email phone")

    if(!getRequestbyId) throw ApiError.notFound("No pending request");

    return getRequestbyId;

};

//approves teacherRequest 
const approveRequest = async (requestId)=>{

    if(!requestId) throw ApiError.badRequest("requestId is required");

    const request = await teacherRequestModel.findById(requestId);
    if(!request) throw ApiError.notFound("No request found")

    const user = await User.findById(request.userId);
    if(!user) throw ApiError.notFound("No user found");

    user.role = "teacher";
    await user.save();

    request.status="approved";  
    request.reviewedAt = new Date();

    await request.save();

    return {
        message: "request is handled- approved!"
    }
}

// reject teacherRequest
const rejectRequest = async (requestId)=>{
    if(!requestId) throw ApiError.badRequest("RequestId is required");

    const request = await teacherRequestModel.findById(requestId);
    if(!request) throw ApiError.notFound("No request found");

    request.status="rejected";
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
    rejectRequest
}