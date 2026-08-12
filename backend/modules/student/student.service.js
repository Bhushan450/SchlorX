import Student from "./student.model.js"
import User from "../auth/auth.model.js"
import Class from "../class/class.model.js";
import ApiError from "../../common/utils/ApiError.js"


// create student 
const createStudent = async (data,classId)=>{

    const{name,rollNo,DOB,gender,parentPhone} = data;
    // validations will done by DTO

    if(!classId) throw ApiError.badRequest("classId is required")

        const existingClass = await Class.findOne({
        _id:classId,
    });
    if(!existingClass) throw ApiError.notFound("No Class found , Please assign a class to student");

    const currentClassId = classId

    const existingStudent = await Student.findOne({
        rollNo,
        classId:currentClassId
    });
    if(existingStudent) throw ApiError.conflict("Student already exits");

    const studentObj = await Student.create({
        name,
        rollNo,
        classId:currentClassId,
        DOB,
        gender,
        parentPhone,
    })

    // automatically increment the studentCount wheneever the new student is created and sync with totalStudents
    await Class.findByIdAndUpdate(
        classId,
        { $inc: { totalStudents: 1 } }
    );

    return studentObj;
};

// update student 
const updateStudent = async (data,studentId,classId)=>{

    const{name,rollNo,DOB,gender,parentPhone} = data
    // validations will done by DTO

    if(!studentId) throw ApiError.badRequest("StudentId must be required");

    const currentClassId = classId
    // only allow updating those students who are belonging to this class only 
    const student = await Student.findOne({
         _id: studentId,
         classId: currentClassId,
    });

    if (!student) {
        throw ApiError.notFound("Student not found");
    }

    if (rollNo) {
        const existingStudent = await Student.findOne({
            rollNo,
            classId: student.classId,
            _id: { $ne: studentId }
        });

        if (existingStudent) {
            throw ApiError.conflict(
                "Roll number already exists in this class"
            );
        }
    }

    if(name)student.name = name;
    if(rollNo)student.rollNo = rollNo;
    if(DOB)student.DOB = DOB;
    if(gender)student.gender = gender;
    if(parentPhone)student.parentPhone = parentPhone;

    await student.save();

    return student;

};

// get allStudents
const getAllStudents = async (classId)=>{

    if(!classId) throw ApiError.badRequest("Teacher is not assigned to any class")
    const students = await Student.find({
        classId
    }).sort({ rollNo: 1 });

    return students;
};

//get studentBy ID
const getStudentById = async(studentId,currentClassId)=>{
    if(!studentId) throw ApiError.badRequest("StudentId is required");
    if(!currentClassId) throw ApiError.badRequest("CurrenClassId is required")

    const student = await Student.findOne({
        _id: studentId,
        classId: currentClassId
    });
    if(!student) throw ApiError.notFound("Student not found in this class");

    return student;
};

//delete student
const deleteStudent = async (studentId,currentClassId)=>{
    if(!studentId) throw ApiError.badRequest("StudentId is required");
    if(!currentClassId) throw ApiError.badRequest("Teacher is not assigned to class yet")

    const student = await Student.findOne({
        _id: studentId,
        classId: currentClassId
    });
    if(!student) throw ApiError.notFound("Student not found in this class");

    await student.deleteOne();

    return {message:"student deleted successfully"}
};

export {
    createStudent,
    updateStudent,
    getAllStudents,
    getStudentById,
    deleteStudent
}