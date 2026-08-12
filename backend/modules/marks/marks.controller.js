import ApiResponse from "../../common/utils/ApiResponse.js";
import * as markServices from "./marks.service.js"

// Add / update marks
const addMarks = async (req, res) => {

    const marksRes = await marksService.addMarks(req.body,req.user.id);
    ApiResponse.created(res,"Marks added successfully",marksRes);
};

// Get marks of an entire exam
const getMarksByExam = async (req, res) => {

    const marksRes = await marksService.getMarksByExam(req.params.examId,req.user.id);
    ApiResponse.ok(res,"Exam marks fetched successfully",marksRes);
};

// Get all marks of a particular student
const getMarksByStudent = async (req, res) => {

    const marksRes = await marksService.getMarksByStudent(req.params.studentId,req.user.id);
    ApiResponse.ok(res,"Student marks fetched successfully",marksRes);
};

export {
    addMarks,
    getMarksByExam,
    getMarksByStudent
};