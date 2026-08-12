import * as teacherService from "./teacher.service.js"
import ApiResponse from "../../common/utils/ApiResponse.js"

const getTeacherById = async (req,res)=>{
    // get teacher with id
    const teacher = await teacherService.getTeacherById(req.params.Id);
    ApiResponse.ok(res,"Teacher returned", teacher)
};
const updateTeacher = async (req,res)=>{
    // update teacher field
    const teacher = await teacherService.updateTeacher(req.body , req.params.Id);
    ApiResponse.ok(res,"Teacher is updated", teacher)
};
const changePassword = async (req,res)=>{
    // change password
    const updatePasswordRes = await teacherService.changePassword(req.body,req.user.id);
    ApiResponse.ok(res,"Password updated successfully",updatePasswordRes);
}
const deleteTeacher = async (req,res)=>{
    // delete teacher from DB
    await teacherService.deleteTeacher(req.params.id);
    ApiResponse.ok(res,"Teacher is deleted")
};

export {
    getTeacherById,
    updateTeacher,
    changePassword,
    deleteTeacher,
}


