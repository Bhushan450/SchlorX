import ApiError from "../../common/utils/ApiError.js";
import Class from "../class/class.model.js";
import Student from "../student/student.model.js";
import Attendence from "./attendence.model.js";

// mark attendence
const attendence = async (data, classId) => {

    if (!classId) throw ApiError.badRequest("Class is not created yet")
    if (!data) throw ApiError.badRequest("Attendence data is required")

    const { date, students } = data;

    const existingClass = await Class.findById(classId);
    if (!existingClass) throw ApiError.notFound("Class is not exits")

    // check if the attendence of a class is already marked for a day or not
    const alreadyMarked = await Attendence.findOne({
        class: classId,
        date,
    });
    if (alreadyMarked) throw ApiError.badRequest("Attendence of class is already marked");

    const records = [];

    // pushing all data into single record(records[]) 
    for (const student of students) {

        // // check if the student exits or not 
        // const existingStudent = await Student.findOne({
        //     _id: student.studentId,
        //     class: classId,
        // });
        // if(!existingStudent) throw ApiError.notFound(`Student ${student.studentId} not found in this class`);

        // this will map return the new array of students id's
        const ids = students.map(s => s.studentId);

        const existingStudent = await Student.findOne({ _id: student.studentId, classId: classId });
        if (!existingStudent) throw ApiError.notFound(`Student: ${ids} not found in class`)


        records.push({    // creating the records(attendence) array and inserting all the elements at a time to MonogDb
            student: student.studentId,
            class: classId,
            date,
            status: student.status,
        });

        // attendence documnet creates when we do inserMany()

    }

    // Insert all attendance records together
    const attendance = await Attendence.insertMany(records);

    return attendance;


};

// get attendence of class (date)
const getAttendanceByDate = async (data, classId) => {

    const { date } = data;
    if (!date) throw ApiError.badRequest("Date is required");

    const existingClass = await Class.findById(classId);
    if (!existingClass) throw ApiError.notFound("Class not exits");

    //find attendence of a whole students of a particular date
    const attendence = await Attendence.find({
        class: classId,
        date,
    }).populate("student", "name rollNo"); // to show a student , name and its rollNo on frontend
    if (attendence.length === 0) throw ApiError.notFound("Attendence not found");

    // sort the students based on roll no
    attendence.sort((a, b) => a.student.rollNo - b.student.rollNo);

    return attendence;
};

// get attendence of a particular student
const getAttendanceByStudent = async (studentId, classId) => {

    if (!studentId || !classId) throw ApiError.badRequest("StudentId and classId is required");

    const student = await Student.findOne({
        _id: studentId,
        classId: classId,
    });
    if (!student) throw ApiError.notFound("Student not found");

    //findAttendence of a student of particular classs
    const attendenceByStudent = await Attendence.find({
        class: classId,
        student: studentId,
    }).sort({ date: -1 }).populate("student", "name rollNo");

    if (attendenceByStudent.length === 0) throw ApiError.notFound("Attendence not found on this Id");

    return attendenceByStudent;

};

export {
    attendence,
    getAttendanceByDate,
    getAttendanceByStudent,
}