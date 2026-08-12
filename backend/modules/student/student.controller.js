import * as studentService from "../student/student.service.js"
import ApiResponse from "../../common/utils/ApiResponse.js"


const createStudent = async (req,res)=>{
    // create a Student
    const studentRes = await studentService.createStudent(req.body , req.user.classAssigned);
    ApiResponse.created(res,"Student is created", studentRes)
};

const updateStudent = async (req,res)=>{
    // register a user
    const studentRes = await studentService.updateStudent(req.body,req.params.id, req.user.classAssigned);
    ApiResponse.created(res,"Student updated successfully", studentRes)
};

const getAllStudents = async (req,res)=>{
    // register a user
    const studentRes = await studentService.getAllStudents(req.user.classAssigned);
    ApiResponse.created(res,"Fetched all students", studentRes)
};

const getStudentById = async (req,res)=>{
    // register a user
    const studentRes = await studentService.getStudentById(req.params.id , req.user.classAssigned);
    ApiResponse.created(res,"Student fetched", studentRes)
};
const deleteStudent = async (req,res)=>{
    // register a user
    const studentRes = await studentService.deleteStudent(req.params.id , req.user.classAssigned);
    ApiResponse.created(res,"Student deleted successfully", studentRes)
};

export{
    createStudent,
    updateStudent,
    getAllStudents,
    getStudentById,
    deleteStudent
}









