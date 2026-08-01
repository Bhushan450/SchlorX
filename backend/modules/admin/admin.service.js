import User from "../auth/auth.model.js"
import Class from "../class/class.model.js"
import ApiError from "../../common/utils/ApiError.js";
import { generateResetTokens } from "../../common/utils/jwt";

// Create teacher (by admin)
const createTeacher = async (data)=>{

    const {name,email,phone,password,role} = data;
    if(!name) throw ApiError.badRequest("Name is required");
    if(!email) throw ApiError.badRequest("Email is required");
    if(!phone) throw ApiError.badRequest("Phone is required");
    if(!password) throw ApiError.badRequest("Password is required");
    
    const user = await User.findOne({email});
    if(user) throw ApiError.conflict("Teacher is already exists");

    const {rawToken, hashedToken} = generateResetTokens();

    const teacher = await User.create({
        name,
        email,
        phone,
        password,
        role:"teacher",
        verificationToken:hashedToken,
    });

    // send email for verification(for login purpose)

    const teacherObj = teacher.toObject();

    return teacherObj;
 };

 //get teacher by id
 const getTeacherById = async (teacherId)=>{

    if(!teacherId) throw ApiError.badRequest("Teacher id is required");

    const teacher = await User.findOne({
        _id:teacherId,
        role:"teacher",
    });
    if(!teacher) throw ApiError.notFound("Teacher not found");

    return teacher;
 };

 // update teacher 
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

 // delete teacher 
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

    // remove this document from DB
    await teacher.deleteOne();  

 };

 // assignedClassToTeacher
 const assignClassToTeacher = async (classId,teacherId)=>{

   if(!classId || !teacherId) throw ApiError.badRequest("classId and teacherId is required");

   const teacher = await User.findOne({
      _id:teacherId,
      role:"teacher",
   });
   if(!teacher) throw ApiError.notFound("User not found");

   const classObj = await Class.findById(classId);
   if(!classObj) throw ApiError.notFound("Class not found , Please create a class");

   // if teacher already assigned to class remove them 
   if(teacher.classAssigned)
   {
      const ClassOBJ = await Class.findOne({classTeacher:teacherId}); 
      if(ClassOBJ) 
         {
            ClassOBJ.classTeacher=null;
            await ClassOBJ.save();
         }
   }

   if(classObj.classTeacher) throw ApiError.conflict("Teacher is already assigned to this class")

   // assign class to teacher and sync the both models
   teacher.classAssigned = classId;
   classObj.classTeacher = teacherId;
    
   await teacher.save()
   await classObj.save()

   const teacherObj = teacher.toObject();

   return teacherObj;
 };

 export {
    createTeacher,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    assignClassToTeacher,
 }