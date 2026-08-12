import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class  CreateStudentDto extends BaseDto {

    static schema = Joi.object({
    name: Joi.string().trim().min(1).max(20).required(),
    rollNo: Joi.number().integer().min(0).max(150).required(),
    DOB: Joi.date().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
    parentPhone: Joi.string().trim().pattern(/^[0-9]{10}$/).optional()
    .messages({
            "string.pattern.base": "Parent phone must be exactly 10 digits"
        })
})};

export default CreateStudentDto;