import ApiError from "../../common/utils/ApiError.js";
import Exam from "./exam.model.js";
import User from "../auth/auth.model.js"

// create Exam
const createExam = async (examData,classTeacherId)=>{

    const {examType , academicYear, examDate} = examData;
    if(!examType || !academicYear || !examDate) throw ApiError.badRequest("Enter the valud fields");

    const existingTeacher = await User.findOne({
        _id:classTeacherId,
        role:"teacher",
    });
    if(!existingTeacher) throw ApiError.notFound("Teacher not found");

    if(!existingTeacher.classAssigned) throw ApiError.badRequest("Teacher has no assigned class")

    const existingExam = await Exam.findOne({
        class: existingTeacher.classAssigned,
        examType,
        academicYear,
        examDate,
    });
    if(existingExam) throw ApiError.conflict("Exam already exist");

    const examObj = await Exam.create({
        examType,
        academicYear,
        examDate,
        class: existingTeacher.classAssigned,
        createdBy: classTeacherId,
    })

    return examObj;
};

// update Exam
const updateExam = async (dataChange,examId,classTeacherId) =>{

    const {examType,academicYear,examDate} = dataChange;
    // valiations will done by DTO
    if(!examId) throw ApiError.badRequest("ExamId is required");

    // Check whether the user is a teacher
    const teacher = await User.findOne({
        _id: classTeacherId,
        role: "teacher",
    });

    if (!teacher) {
        throw ApiError.notFound("Teacher not found");
    }
    
    // check if the teacher has class assigned or not
    if (!teacher.classAssigned) {
        throw ApiError.badRequest("Teacher has no assigned class");
    }


   const existingExam = await Exam.findOne({
        _id:examId,
        class: teacher.classAssigned
        
    });
    if(!existingExam) throw ApiError.notFound("Exam not exits");

    const duplicateExam = await Exam.findOne({
        _id: { $ne: examId },
        class: teacher.classAssigned,
        examType,
        academicYear,
        examDate,
    });
    
    if (duplicateExam) {
        throw ApiError.conflict("Exam already exists, Please make a valid changes");
    };

    existingExam.examType = examType;
    existingExam.academicYear = academicYear;
    existingExam.examDate = examDate;

    await existingExam.save();

    return existingExam;

};

// get all exams of a class
const getAllExams = async (classTeacherId)=>{
    if(!classTeacherId) throw ApiError.badRequest("coudnlt found classTeacher Id");

    const existingTeacher = await User.findOne({
        _id: classTeacherId,
        role: "teacher"
    });
    if(!existingTeacher) throw ApiError.notFound("Teacher not found");

    if(!existingTeacher.classAssigned) throw ApiError.badRequest("Teacher has no assigned class");

    // find all exams of a class
    const allExams = await Exam.find({
        class: existingTeacher.classAssigned,
    }).sort({examDate:-1 ,})   // Sort exams by exam date, newest first

    // if there is no exam created - will get empty array

    return allExams;
};

export {
    createExam,
    updateExam,
    getAllExams
}