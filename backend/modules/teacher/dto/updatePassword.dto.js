import BaseDto from "../../../common/dto/base.dto.js";
import joi from "joi";

class UpdatePasswordDto extends BaseDto {
    static schema = joi.object({
        currentPassword: joi.string().min(6).required(),
        newPassword: joi.string().min(6).message("password must contain 6 chars minnimum").required()
    });
}

export default UpdatePasswordDto;