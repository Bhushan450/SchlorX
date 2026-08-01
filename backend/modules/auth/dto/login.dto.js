import joi from 'joi'
import BaseDto from '../../../common/dto/base.dto.js'

class LoginDto extends BaseDto {
     static schema = joi.object({
        email : joi.string().email().lowercase().required(),
        password : joi.string().messages({"string.min": "Password must contain at least 6 characters"})
        .trim().min(6).max(20).required(),

     })
}

export default LoginDto;
