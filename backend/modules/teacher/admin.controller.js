import * as adminService from "./admin.service.js"
import ApiResponse from "../../common/utils/ApiResponse.js"


// const createTeacher = async (req,res)=>{
//     // register a user
//     const teacher = await adminService.createTeacher(req.body);
//     ApiResponse.created(res,"Teacher is created", teacher)
// };

const getTeacherById = async (req,res)=>{
    // get teacher with id
    const teacher = await adminService.getTeacherById(req.params.Id);
    ApiResponse.ok(res,"Teacher returned", teacher)
};
const updateTeacher = async (req,res)=>{
    // update teacher field
    const teacher = await adminService.updateTeacher(req.body , req.params.Id);
    ApiResponse.ok(res,"Teacher is updated", teacher)
};
const deleteTeacher = async (req,res)=>{
    // delete teacher from DB
    await adminService.deleteTeacher(req.params.id);
    ApiResponse.ok(res,"Teacher is deleted")
};

// const assignClassToTeacher = async (req,res)=>{
//     // delete teacher from DB
//     await authService.assignClassToTeacher(req.params.id , req.class.id);
//     ApiResponse.created(res,"Class assigned successfully")
// };

export {
    createTeacher,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    assignClassToTeacher,
}


