import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateExamDto extends BaseDto {
    static schema = Joi.object({
        examType: Joi.string().trim(),
        academicYear: Joi.string().trim(),
        examDate: Joi.date(),
    }).min(1).messages({
        "object.min": "At least one field is required to update",
    });
}

export default UpdateExamDto;