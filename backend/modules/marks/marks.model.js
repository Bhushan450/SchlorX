import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        marksObtained: {
            type: Number,
            required: true,
            min: 0,
        },
        totalMarks: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {timestamps: true}
);

// One student cannot have two marks records
// for the same subject in the same exam.
// student+marks+subject -> only one combination possible
marksSchema.index(
    {
        exam: 1,
        student: 1,
        subject: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model("Marks", marksSchema);