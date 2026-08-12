import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdateStudentDto extends BaseDto {
    static schema = Joi.object({

    name: Joi.string().trim().min(1).max(20),
    rollNo: Joi.number().integer().min(0).max(150),
    DOB: Joi.date(),
    gender: Joi.string().valid("male", "female", "other"),
    parentPhone: Joi.string().trim().pattern(/^[0-9]{10}$/)
    .messages({
            "string.pattern.base": "Parent phone must be exactly 10 digits"
        })
})

.min(1)
.messages({
    "object.min": "At least one field is required to update"
});
}

export default UpdateStudentDto;