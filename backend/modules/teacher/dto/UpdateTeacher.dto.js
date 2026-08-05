import BaseDto from "../../../common/dto/base.dto";
import joi from "joi";

class UpdateTeacherDto extends BaseDto{
    static schema = joi.object({
        name: joi.string().trim().min(2).max(30).required(),
        email: joi.string().trim().email().min(2).max(30).required(),
        phone: joi.string().trim().pattern(/^\d{10}$/).required(),
        password: joi.string().min(6).message("password must contain 6 chars minnimum").required(),
    })
}

export default UpdateTeacherDto