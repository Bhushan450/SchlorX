import mongoose from "mongoose";

const classSchema = new mongoose.Schema({

    className:{
        type:String,
        trim:true,
        minlength:1,
        maxlength:10,
        required:[true,"Name of class is required"],
    },
    classTeacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:null,
    },
    section:{
        type:String,
        default:null,
    },
    totalStudents:{
        type: Number,
        default: 0,
        min: 0
    },
    academicYear:{
        type:String,
        trim:true,
        minlength:4,
        maxlength:10,  
    }  
}, {timestamps:true})

export default mongoose.model("Class",classSchema)