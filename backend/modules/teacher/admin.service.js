import User from "../auth/auth.model.js";
import Class from "../class/class.model.js";
import ApiError from "../../common/utils/ApiError.js";
import { generateResetTokens } from "../../common/utils/jwt.js";

 //get teacher by id (admin)
 const getTeacherById = async (teacherId)=>{

    if(!teacherId) throw ApiError.badRequest("Teacher id is required");

    const teacher = await User.findOne({
        _id:teacherId,
        role:"teacher",
    });
    if(!teacher) throw ApiError.notFound("Teacher not found");

    return teacher;
 };

 // update teacher (teacher)
 const updateTeacher = async (data,teacherId)=>{

    const {name,email,password,phone} = data;

    // find a user whose id:teacherId and role=="teacher"
    const teacher = await User.findOne({
    _id: teacherId,
    role: "teacher"
    });

    if(!teacher) throw ApiError.notFound("User not found");

    // find user(admin/teacher) with this email whose id not equals to teacherId
    const existingEmail = await User.findOne({
        email,
        _id:{ $ne:teacherId }
    });
    if(existingEmail) throw ApiError.conflict("Email already exits! try different one")

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (phone) teacher.phone = phone;
    if (password) teacher.password = password;

    await teacher.save();

    return teacher;
 };

 // delete teacher (teacher)
 const deleteTeacher = async (teacherId)=>{
    if(!teacherId) throw ApiError.badRequest("teacherId required");

    const teacher = await User.findOne({
        _id:teacherId,
        role:"teacher"
    });
    if(!teacher) throw ApiError.notFound("Teacher not found");

    // find the class whose classTeacher is this 
    const existingClass = await Class.findOne({classTeacher:teacherId});
    if(existingClass)
      {
         existingClass.classTeacher = null; // remove the the teacher from its class
         await existingClass.save();
      } 

    // instead of deleting the user directly demote it from "teacher" to "user"
      teacher.role = "user";
      teacher.classAssigned = null;
      await teacher.save();
      
 };
 export {
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    assignClassToTeacher,
 }