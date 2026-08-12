import express from "express"
import cookieParser from "cookie-parser";
import authRoute from "../modules/auth/auth.routes.js";
import teacherRoute from "../modules/teacher/admin.routes.js";
import teacherRequestRoute from "../modules/teacher_request/teacherRequest.routes.js";
import classRoute from "../modules/class/class.routes.js";
import studentRoute from "../modules/student/student.routes.js";
import attendanceRoute from "../modules/attendence/attendence.routes.js";
import examRoute from "../modules/exam/exam.routes.js";
import marksRoute from "../modules/marks/marks.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/auth' , authRoute);

app.use("/api/teacher", teacherRoute);

app.use("/api/teacher-request", teacherRequestRoute);

app.use("/api/class", classRoute);

app.use("/api/student", studentRoute);

app.use("/api/attendance", attendanceRoute);

app.use("/api/exam", examRoute);

app.use("/api/marks", marksRoute);


// Global error handler — MUST be last, MUST have exactly 4 params
app.use((err, req, res, next) => {
    const statusCode = err.statuscode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        // only show stack trace in dev
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
});

export default app;

