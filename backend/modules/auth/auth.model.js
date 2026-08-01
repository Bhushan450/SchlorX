import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    
    name:{
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 30,
        required: [true,"name is required"],
    },
    email:{
        type:String,
        trim:true,
        minlength:2,
        maxlength:30,
        unique: true,
        lowercase:true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please enter a valid email address"], // regular expressions for email matching 
        required: [true, "email is required"]
    },
    phone:{
        type:String,
        trim:true,
        match:[/^\d{10}$/,"Phone number must contain exactly 10 digits"],
        unique:true,
        required:[true, "phone number is required"],
    },
    password:{
        type:String,
        minlength:6, // we dont write a maxlength for password -> after hashing lengh coulb become 50+ size
        required:[true,"password is required"],
        select:false,
    },
    role:{
        type:String,
        trim:true,
        enum:["admin","teacher"],
        required:[true,"role is required"],
    },
    classAssigned:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        default:null, 
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    verificationToken:{type: String,select: false},  // unselect the token when object returns },
    verificationTokenExpires: {type: Date,select: false},
    refreshToken:{type: String,select:false},
    resetPasswordToken:{type: String,select:false},
    resetPasswordExpires:{type: Date,select:false},
} , {timestamps:true});

//Hook for password change/ updated
// "Before saving a document to the database, run this function."
// if password changes then hash it and stores in DB
userSchema.pre("save" , async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password , 12);
});

// comapre the new-password with DB password (user is changing the password)
userSchema.methods.comparePassword = async function(plainTextPassword){
    return bcrypt.compare(plainTextPassword , this.password)
}

export default mongoose.model("User",userSchema); // in DB i will be -> "users"
