import mongoose from "mongoose";
import Class from "./class.model.js";
import User from "../auth/auth.model.js";
import Student from "../student/student.model.js";
import ApiError from "../../common/utils/ApiError.js";
import teacherRequestModel from "../teacher_request/teacherRequest.model.js";

// create class
const createClass = async (data,teacherId)=>{

    const{className,academicYear} = data;
    // validations will done through DTO 

    const teacher = await User.findOne({
        _id:teacherId,
        role:"teacher",
    })
    if(!teacher) throw ApiError.notFound("Teacher not found");
    if(teacher.classAssigned) throw ApiError.conflict("Teacher is already assigned to class")


    const existingClass = await Class.findOne({
        className,
        academicYear,
    });
    if(existingClass) throw ApiError.conflict("Class already exits");

    const classObj = await Class.create({
        className,
        classTeacher:teacherId,
        totalStudents,
        academicYear,
    });

    teacher.classAssigned = classObj._id;
    await teacher.save();

    return classObj;

};

// update class 
const updateClass = async(classData, classId)=>{

    const{className,section,totalStudents,academicYear} = req.body;
    if(!name || ! section || !totalStudents || !academicYear) throw ApiError.badRequest("all fields are required");

    const existingClass = await Class.findById(classId);
    if(!existingClass) throw ApiError.notFound("Class not found");

    existingClass.className = className;
    existingClass.section = section;
    existingClass.totalStudents = totalStudents;
    existingClass.academicYear = academicYear;

    await existingClass.save();

    return existingClass;
};

//get all classes
const getAllclasses = async ()=>{

    const classes = await Class.find() // returns all documents of Class model

    return classes;
    
};

// get class by id
const getClassById = async (classId)=>{
    if(!classId) throw ApiError.badRequest("ClassId is required")

    const classObj = await Class.findById(classId)
    .populate("_id","className","classTeacher","email");

    if(!classObj) throw ApiError.notFound("Class not found on this id");

    return classObj;
};

// delete class
const deleteClass = async (classId)=>{

    if(!classId) throw ApiError.badRequest("ClassId is required");

    // implemented a rollBack functionality
    // Start MongoDB session
    const session = await mongoose.startSession();

    try {

        // Start transaction
        session.startTransaction();

        const classObj = await Class.findById(classId).session(session)
        if(!classObj) throw ApiError.notFound("Class not found on this Id");
    
        const teacherObj = await User.findOne({classAssigned:classId}).session(session)
        if(teacherObj) 
        {
            teacherObj.classAssigned = null;
            await teacherObj.save({session,validateBeforeSave:false});
        }
    
        // if the class is deleted , delete all students from class(sorry students u loose ur papa!!)
        await Student.deleteMany({classId:classId}).session(session);
         
        //delete this class from model
        await classObj.deleteOne(session);

        // Everything successful
        await session.commitTransaction();
    
        return {
        message: "Class deleted successfully"
        };
    } catch (error) {

        // Undo everything
        await session.abortTransaction();

        throw error;
    } finally {

        // Always close the session
        await session.endSession();
    }
};

export {
    createClass,
    updateClass,
    getAllclasses,
    getClassById,
    deleteClass,
}
