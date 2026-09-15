import ApiResponse from "../../common/utils/ApiResponse.js";
import * as teacherRequestService from "./teacherRequest.service.js"

const createTeacherRequest = async (req, res) => {
    // create a request
    const requestRes = await teacherRequestService.createTeacherRequest(req.user.id);
    ApiResponse.created(res, "TeacherRequest is created", requestRes)
};

const getAllRequests = async (req, res) => {
    // get allRequest
    const requestRes = await teacherRequestService.getAllRequests();
    ApiResponse.ok(res, "all TeacherRequests fetched", requestRes)
};

const getRequestById = async (req, res) => {
    // get RequestById
    const requestRes = await teacherRequestService.getRequestById(req.params.requestId);
    ApiResponse.ok(res, "teacherRequest fecthed", requestRes)
};

const approveRequest = async (req, res) => {
    // approve request
    const requestRes = await teacherRequestService.approveRequest(req.params.requestId);
    ApiResponse.ok(res, "teacherRequest approved!", requestRes)
};
const rejectRequest = async (req, res) => {
    // approve request
    const requestRes = await teacherRequestService.rejectRequest(req.params.requestId);
    ApiResponse.ok(res, "teacherRequest rejected!", requestRes)
};
const getProcessedRequests = async (req, res) => {

    const requests = await teacherRequestService.getProcessedRequests();
    ApiResponse.ok(res, "Processed teacher requests fetched successfully", requests);
};

export {
    createTeacherRequest,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    getProcessedRequests
}
