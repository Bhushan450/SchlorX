import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        minlength:1,
        maxlength:20,
        required:[true,"Student name is required"]
    },
    rollNo:{
        type:Number,
        min:0,
        max:150,
        unique:true,
        required:[true,"Roll no. is required"]
    },
    classId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Class",
        default:null,
    },
    DOB:{
        type:Date,  
    },
    gender:{
        type:String,
        trim:true,
        enum:["male","female","other"],
    },
    parentPhone:{
        type:String,
        trim:true,
        minlength:10,
        maxlength:10,
    },

},{timestamps:true});

export default mongoose.model("Student",studentSchema);