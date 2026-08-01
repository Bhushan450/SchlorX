import joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js"

class RegisterDto extends BaseDto {

    static schema = joi.object({
        name: Joi.string().trim().min(2).max(30).required(),
        email: Joi.string().trim().email().required(),
        phone: Joi.string().pattern(/^\d{10}$/).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("admin", "teacher").required(),
        classAssigned: joi.string().optional(),
    })  
};

export default RegisterDto;