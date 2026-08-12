import ApiError from "../../common/utils/ApiError.js";
import User from "./auth.model.js"
import { 
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateResetTokens,
} from "../../common/utils/jwt.js";
import{
    sendMail,
    sendVerificationEmail,
    sendOrderConfirmationEmail,
    sendResetPasswordEmail
} from "../../common/utils/email.js"

import crypto from "crypto";
import bcrypt from "bcryptjs";

// hashes the tokens
const hashToken = (token)=>{
    return crypto
       .createHash("sha256")
       .update(token)
       .digest("hex")
}

// register the user (sign-up) 
const register = async (data, res)=>{

    const {name,email,password,role,phone,} = data;
    if(!name) throw ApiError.badRequest("name is required");
    if(!email) throw ApiError.badRequest("email is required");
    if(!password) throw ApiError.badRequest("password is required");
    if(!phone) throw ApiError.badRequest("phone is required");

    const existingUser = await User.findOne({email}).select("+password +refreshToken");
    if(existingUser) throw ApiError.conflict("User already exits");

    const {rawToken , hashedToken} = generateResetTokens();

    const user = await User.create({
        name,
        email,
        password,
        role:"user", // client is "user" when first time enters
        phone,
        verificationToken:hashedToken,
    })

    // send email to verify
        try {
            await sendVerificationEmail(email , rawToken)
        } catch (error) {
            console.log(error);     
        }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    // delete userObj.verificationToken;

    return userObj;
};

// login user 
const login = async (credetials,res)=>{

    const{email,password} = credetials;
    if(!email) throw ApiError.badRequest("email is required");
    if(!password) throw ApiError.badRequest("password is required");

    //fetch user from database
    const user = await User.findOne({email}).select("+password");
    if(!user) throw ApiError.notFound("User not found");
    if(!user.isVerified) throw ApiError.forbidden("Please verify your email before log-in")

    // check password 
    const isMatch = await user.comparePassword (password);
    if(!isMatch) throw ApiError.unauthorised("check email or password");

    // generate tokens
    const accessToken = generateAccessToken(user._id,user.role);
    const refreshToken = generateRefreshToken(user._id,user.role);

    user.refreshToken = hashToken (refreshToken);

    await user.save({validateBeforeSave:false});

    // delete unwanted fields from object to avoid sending password and refreshToken to user 
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    // try for send data in cookies 
    return {user:userObj, accessToken , refreshToken}
};

// refreshTokens (accessTokens and refreshTokens)
const refresh = async (token)=>{

    if(!token) throw ApiError.unauthorised("RefreshToken missing");
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded._id).select("+refreshToken")
    if(!user) throw ApiError.notFound("User not found");

    //verify the refreshToken matches what's stored 
    if(user.refreshToken !== hashToken(token)) throw ApiError.conflict("Invalid refresh token-Please login again");

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = hashToken(refreshToken);

    await user.save({validateBeforeSave:false});

    return {accessToken , refreshToken};
};

// logout the user (remove the refreshToken from DB)
const logout = async (userId)=>{
    await User.findByIdAndUpdate(userId,{refreshToken:null});
};

// forgotPassword
const forgotPassword = async (req,res)=>{

    const{email} = req.body;
    if(!email) throw ApiError.badRequest("Email is required");

    const user = await User.findOne({email});
    if(!user) throw ApiError.notFound("User not found");

    const{rawToken,hashedToken} = generateResetTokens();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + Number(process.env.JWT_RESET_EXPIRES);

    // send email with rawtokens to verify email
    //TODO : mail bhejna nhi aata 
    try {
        await sendResetPasswordEmail(email , rawToken)
    } catch (error) {
        console.log(error);     
    }

    await user.save({validateBeforeSave:false});

};

// resetPassword
const resetPassword = async (data,token)=>{

    const {password} = data;
    if(!password) throw ApiError.badRequest("Password is required");
    if(!token) throw ApiError.badRequest("didnt get token through email");

    const hashedToken = hashToken(token);

    const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");
    if(!user)
    {
        throw ApiError.unauthorised("Invalid or expired reset token")
    }

    user.password = password;
    user.resetPasswordToken=undefined;
    user.refreshToken=undefined;
    user.resetPasswordExpires=undefined;

    await user.save();

    return user;
};

// sendVerification Email  (Remaining)
const verifyEmail = async (token)=>{
    const hashedToken = hashToken(token);
    
        const user = await User.findOne({verificationToken: hashedToken}).select("+verificationToken");
        if(!user) throw ApiError.notFound("User not found");
    
        user.isVerified = true;
        user.verificationToken = undefined;
    
        await user.save();
    
        return user;
}
// getProfile
const getProfile = async (userId)=>{

    const user = await User.findById(userId);
    if(!user) throw ApiError.notFound("User not found");

    return user; 
};

// update profile.
const updateProfile = async (data,userId)=>{

    const{name, phone, email} = data;

    
}

export {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    getProfile,
    verifyEmail,
}
