import ApiError from "../../common/utils/ApiError.js";
import Marks from "./marks.model.js";
import User from "../auth/auth.model.js"
import Exam from "../exam/exam.model.js";
import Student from "../student/student.model.js"

const SUBJECTS=[
    "Mathematics",
    "Science",
    "English",
    "Marathi",
    "Hindi",
    "Geography",
    "History",
    "Sanskrit",
    "Sports",
    "Other Activities"
];

// add marks of student
const addMarks = async (data, teacherId) => {

    const {examId,subject,totalMarks,students} = data;

    // Validations
    if (!examId) throw ApiError.badRequest("ExamId is required");

    if (!subject) throw ApiError.badRequest("Subject is required");

    if (
        totalMarks === undefined ||
        totalMarks === null ||
        totalMarks <= 0
    ) throw ApiError.badRequest("Valid total marks is required");
    
    if (!students || students.length === 0)
        throw ApiError.badRequest("Students marks are required");

    if (!SUBJECTS.includes(subject))
        throw ApiError.badRequest("Invalid subject");


    // Get teacher and assigned class
    const teacher = await User.findOne({
        _id: teacherId,
        role: "teacher"
    }).select("classAssigned");

    if (!teacher)
        throw ApiError.notFound("Teacher not found");

    if (!teacher.classAssigned)
        throw ApiError.badRequest(
            "Teacher has no class assigned"
        );

    const classId = teacher.classAssigned;


    // Check exam exists and belongs to teacher's class
    const existingExam = await Exam.findOne({
        _id: examId,
        class: classId
    });

    if (!existingExam)
        throw ApiError.notFound(
            "Exam not found for your assigned class"
        );

    const records = [];

    for (const student of students) {

        // Check student belongs to teacher's class
        const existingStudent = await Student.findOne({
            _id: student.studentId,
            classId: classId
        });

        if (!existingStudent) {
            throw ApiError.notFound(
                `Student ${student.studentId} not found in your class`
            );
        }

        // Validate marks
        if (
            student.marksObtained < 0 ||
            student.marksObtained > totalMarks
        ) {
            throw ApiError.badRequest(
                `Invalid marks for student ${student.studentId}`
            );
        }

        // Upsert operation
        records.push({
            updateOne: {
                filter: {
                    exam: examId,
                    student: student.studentId,
                    subject: subject
                },

                update: {
                    $set: {
                        marksObtained: student.marksObtained,
                        totalMarks: totalMarks
                    }
                },

                upsert: true
            }
        });
    }


    // Insert new OR update existing marks
    const marks = await Marks.bulkWrite(records);

    return marks;
};

// get marks by exam 
const getMarksByExam = async (examId, teacherId) => {

    if (!examId || !teacherId) {
        throw ApiError.badRequest(
            "ExamId and teacherId are required"
        );
    }

    // Get teacher's assigned class
    const teacher = await User.findOne({
        _id: teacherId,
        role: "teacher",
    }).select("classAssigned");

    if (!teacher) {
        throw ApiError.notFound("Teacher not found");
    }

    if (!teacher.classAssigned) {
        throw ApiError.badRequest(
            "Teacher has no class assigned"
        );
    }

    const classId = teacher.classAssigned;

    // Verify exam belongs to teacher's class
    const exam = await Exam.findOne({
        _id: examId,
        class: classId,
    });

    if (!exam) {
        throw ApiError.notFound(
            "Exam not found for your assigned class"
        );
    }

    const marks = await Marks.find({
        exam: examId,
    })
        .populate("student", "name rollNo")
        .sort({ createdAt: 1 });

    if (marks.length === 0) {
        throw ApiError.notFound(
            "No marks found for this exam"
        );
    }

    return marks;
};

// get marks by student
const getMarksByStudent = async (studentId, teacherId) => {

    if (!studentId || !teacherId) throw ApiError.badRequest("StudentId and teacherId are required");

    const teacher = await User.findOne({
        _id: teacherId,
        role: "teacher",
    }).select("classAssigned");

    if (!teacher) throw ApiError.notFound("Teacher not found");

    if (!teacher.classAssigned) throw ApiError.badRequest("Teacher has no class assigned");
    
    const student = await Student.findOne({
        _id: studentId,
        classId: teacher.classAssigned,
    });

    if (!student) throw ApiError.notFound("Student not found in your class");

    const marks = await Marks.find({
        student: studentId,
    }).populate("exam", "examType academicYear examDate")
      .populate("student", "name rollNo")
      .sort({ createdAt: -1 });
        

    if (marks.length === 0) throw ApiError.notFound("No marks found for this student");

    return marks;
};

export {
    addMarks,
    getMarksByExam,
    getMarksByStudent
}