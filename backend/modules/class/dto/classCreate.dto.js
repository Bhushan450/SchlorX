import BaseDto from "../../../common/dto/base.dto.js";
import joi from "joi";

class CreateClassDto extends BaseDto{
    
    static schema = joi.object({
        className : joi.string().trim().min(1).max(10).required(),
        classTeacher : joi.string().trim().default(null).required,
        section: joi.string().trim().default(null),
        academicYear : joi.string().trim().min(4).max(10)
    })
}

export default CreateClassDto;