import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class AddMarksDto extends BaseDto {

    static schema = Joi.object({
        subject: Joi.string()
        .valid(
            "Mathematics",
            "Science",
            "English",
            "Marathi",
            "Hindi",
            "Geography",
            "History",    
            "Sanskrit",
            "Sports",
            "Other Activities"
        )
        .required(),
        
        examId: Joi.string()
            .required()
            .messages({
                "string.empty": "ExamId is required",
                "any.required": "ExamId is required",
            }),

        subject: Joi.string()
            .required()
            .messages({
                "string.empty": "Subject is required",
                "any.required": "Subject is required",
            }),

        totalMarks: Joi.number()
            .positive()
            .required()
            .messages({
                "number.base": "Total marks must be a number",
                "number.positive": "Total marks must be greater than 0",
                "any.required": "Total marks is required",
            }),

        students: Joi.array()
            .items(
                Joi.object({
                    studentId: Joi.string()
                        .required()
                        .messages({
                            "string.empty": "StudentId is required",
                            "any.required": "StudentId is required",
                        }),

                    marksObtained: Joi.number()
                        .min(0)
                        .required()
                        .messages({
                            "number.base": "Marks obtained must be a number",
                            "number.min": "Marks cannot be negative",
                            "any.required": "Marks obtained is required",
                        }),
                })
            )
            .min(1)
            .required()
            .messages({
                "array.min": "At least one student is required",
                "any.required": "Students marks are required",
            }),
    });
}

export default AddMarksDto;