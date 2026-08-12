import BaseDto from "../../../common/dto/base.dto.js";
import joi from "joi";

class UpdateClassDto extends BaseDto{
    
    static schema = joi.object({
        className : joi.string().trim().min(1).max(10).required(),
        section: joi.string().trim().default(null),
        totalStudents : joi.number().min(0).default(0),
        academicYear : joi.string().trim().min(4).max(10)
    })
};

export default UpdateClassDto;