import * as classService from "./class.service.js"
import ApiResponse from "../../common/utils/ApiResponse.js"

const createClass = async (req,res)=>{
    // create a class
    const classRes = await classService.createClass(req.body,req.user.id);
    ApiResponse.created(res,"class is created", classRes)
};

const updateClass = async (req,res)=>{
    // update a class
    const classRes = await classService.updateClass(req.body , req.params.classId);
    ApiResponse.created(res,"Updated class", classRes)
};

const getAllclasses = async (req,res)=>{
    // get all classes
    const classRes = await classService.getAllclasses();
    ApiResponse.created(res,"get all classes", classRes)
};

const getClassById = async (req,res)=>{
    // get classById
    const classRes = await classService.getClassById(req.params.classId);
    ApiResponse.created(res,"get class by id", classRes)
};
const deleteClass = async (req,res)=>{
    // delete a class
    const classRes = await classService.deleteClass(req.params.classId);
    ApiResponse.created(res,"Class deleted", classRes)
};

export {
    createClass,
    updateClass,
    getAllclasses,
    getClassById,
    deleteClass,
}