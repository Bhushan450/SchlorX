import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        examType: {
            type: String,
            enum: [
                "unit_test",
                "mid_semester",
                "end_semester",
            ],
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        academicYear: {
            type: String,
            required: true,
            trim: true,
        },
        examDate: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },{timestamps: true}
);

export default mongoose.model("Exam", examSchema);