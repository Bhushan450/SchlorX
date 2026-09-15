import mongoose from "mongoose";

const teacherRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            // unique: true, // One pending request per user
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);
teacherRequestSchema.index(
    { userId: 1 },
    { unique: true, partialFilterExpression: { status: "pending" } }
);


export default mongoose.model("TeacherRequest", teacherRequestSchema);