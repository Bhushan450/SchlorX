import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateExamDto extends BaseDto{
    static schema = Joi.object({
        examType: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Exam type is required",
                "any.required": "Exam type is required",
            }),

        academicYear: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Academic year is required",
                "any.required": "Academic year is required",
            }),

        examDate: Joi.date()
            .required()
            .messages({
                "date.base": "Exam date must be a valid date",
                "any.required": "Exam date is required",
            }),
    });
}

export default UpdateExamDto;