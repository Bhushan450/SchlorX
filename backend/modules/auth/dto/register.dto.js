import joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js"

class RegisterDto extends BaseDto {

    static schema = joi.object({
        name: joi.string().trim().min(2).max(30).required(),
        email: joi.string().trim().email().required(),
        phone: joi.string().pattern(/^\d{10}$/).required(),
        password: joi.string().min(6).required(),
    })
};

export default RegisterDto;