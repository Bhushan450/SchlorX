import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  }, { timestamps: true, });

// Prevent duplicate attendance for the same student on the same date
attendenceSchema.index(
  { student: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendence", attendenceSchema);