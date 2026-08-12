import ApiResponse from "../../common/utils/ApiResponse.js";
import * as examService from "./exam.service.js"

// create exam controller
const createExam = async (req,res)=>{

    const createExamRes = await examService.createExam(req.body, req.user.id);
    ApiResponse.created(res, "Exam created successfully",createExamRes)
};

// update exam controller
const updateExam = async (req,res)=>{

    const updateExamRes = await examService.updateExam(req.body , req.params.examId, req.user.id);
    ApiResponse.ok(res,"Exam updated successfully",updateExamRes)
};

// get all exams controller 
const getAllExams = async (req,res)=>{

    const getAllExamsRes = await examService.getAllExams(req.user.id) ;
    ApiResponse.ok(res,"All exams fetched successfully",getAllExamsRes)
};

export {
    createExam,
    updateExam,
    getAllExams
}

