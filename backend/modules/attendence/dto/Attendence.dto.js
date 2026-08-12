import BaseDto from "../../../common/dto/base.dto.js"
import joi from "joi"

class AttendenceDto extends BaseDto {

    static schema = joi.object({
    date: Joi.date().required(),

    students: Joi.array()
        .items(
            Joi.object({
                studentId: Joi.string()
                    .hex()
                    .length(24)
                    .required(),

                status: Joi.string()
                    .valid("Present", "Absent")
                    .required(),
            })
        )
        .min(1)
        .required(),
    });
};

export default AttendenceDto;