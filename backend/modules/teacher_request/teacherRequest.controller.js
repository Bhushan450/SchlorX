import ApiResponse from "../../common/utils/ApiResponse.js";
import * as teacherRequestService from "./teacherRequest.service.js"

const createTeacherRequest = async (req,res)=>{
    // create a request
    const requestRes = await teacherRequestService.createTeacherRequest(req.user.id);
    ApiResponse.created(res,"TeacherRequest is created", requestRes)
}; 

const getAllRequests = async (req,res)=>{
    // get allRequest
    const requestRes = await teacherRequestService.getAllRequests();
    ApiResponse.created(res,"all TeacherRequests fetched", requestRes)
}; 

const getRequestById = async (req,res)=>{
    // get RequestById
    const requestRes = await teacherRequestService.getRequestById(req.params.requestId);
    ApiResponse.created(res,"teacherRequest fecthed", requestRes)
}; 

const approveRequest = async (req,res)=>{
    // approve request
    const requestRes = await teacherRequestService.approveRequest(req.params.requestId);
    ApiResponse.created(res,"teacherRequest approved!", requestRes)
}; 
const rejectRequest = async (req,res)=>{
    // approve request
    const requestRes = await teacherRequestService.rejectRequest(req.params.requestId);
    ApiResponse.created(res,"teacherRequest rejected!", requestRes)
}; 

export{
    createTeacherRequest,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
}
