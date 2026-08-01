import joi from "joi"
import BaseDto from "../../../common/dto/base.dto.js"

class forgotPasswordDto extends BaseDto {

    static schema = joi.object({
        email : joi.string().email().lowercase().required(),
    })
}

export default forgotPasswordDto;