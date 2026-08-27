import BaseDto from "../../../common/dto/base.dto.js"
import joi from "joi"

class AttendenceDto extends BaseDto {

    static schema = joi.object({
        date: joi.date().required(),

        students: joi.array()
            .items(
                joi.object({
                    studentId: joi.string()
                        .hex()
                        .length(24)
                        .required(),

                    status: joi.string()
                        .valid("Present", "Absent")
                        .required(),
                })
            )
            .min(1)
            .required(),
    });
};

export default AttendenceDto;