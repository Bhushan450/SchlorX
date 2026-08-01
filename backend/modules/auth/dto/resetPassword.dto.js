import joi from 'joi'
import BaseDto from '../../../common/dto/base.dto.js'

class ResetPasswordDto extends BaseDto {
     static schema = joi.object({
        password: joi.string().min(6).pattern(/(?=.*[A-Z])(?=.*\d)/)
        .message("Password must conatin one uppercase letter and one digit")
        .required()
     });
}

export default ResetPasswordDto;
