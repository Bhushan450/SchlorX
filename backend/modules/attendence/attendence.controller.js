import * as attendenceService from "./attendence.service.js"
import ApiResponse from "../../common/utils/ApiResponse.js"

const attendance = async (req, res) => {

    const attendenceRes = await attendenceService.attendence(req.body, req.user.classAssigned);
    ApiResponse.created(res, "Attendence marked", attendenceRes);
};
const getAttendanceByDate = async (req, res) => {

    const attendenceRes = await attendenceService.getAttendanceByDate(req.body, req.user.classAssigned);
    ApiResponse.ok(res, "Attendence fetched", attendenceRes);
};
const getAttendanceByStudent = async (req, res) => {

    const attendenceRes = await attendenceService.getAttendanceByStudent(req.params.studentId, req.user.classAssigned);
    ApiResponse.ok(res, "Student Attendence fetched", attendenceRes);
};

export {
    attendance,
    getAttendanceByDate,
    getAttendanceByStudent,
}