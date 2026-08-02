import * as authService from "./auth.service.js"
import setAuthCookies from "../../common/utils/setAuthCookies.js";
import ApiResponse from "../../common/utils/ApiResponse.js";

const register = async (req,res)=>{
    // register a user
    const user = await authService.register(req.body);
    ApiResponse.created(res,"Registration successfull", user)
}

const login = async (req, res) => {
    const data = await authService.login(req.body);

    setAuthCookies(res, data.accessToken, data.refreshToken);

    ApiResponse.ok(res, "Login successful", data);
};

const logout = async (req,res)=>{

    const logoutRes = await authService.logout(req.user.id)
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    ApiResponse.ok(res,"Logout Success");

};

const refresh = async(req,res)=>{

    const {accessToken,refreshToken} = await authService.refresh(req.cookies.refreshToken);

    setAuthCookies(res, accessToken, refreshToken);

    ApiResponse.ok(res,"tokens refreshed",accessAndrefreshTokens)
};

const getProfile = async (req,res)=>{
    const user = await authService.getProfile(req.user.id);

    ApiResponse.ok(res,"getProfile succesFull", user)
};

const verifyEmail = async (req,res)=>{
    const user = await authService.verifyEmail(req.params.token);

    ApiResponse.ok(res,"email verification successfull" , user)
};

const forgotPassword = async (req,res)=>{
    const token = await authService.forgotPassword(req.body)

    ApiResponse.ok(res, "email for forgot password sent succesfully!",token )
};

const resetPassword = async (req,res)=>{
    const user = await authService.resetPassword(req.body,req.params.token);
     
    ApiResponse.ok(res,"Passowrd is reset", user )
};

export {
    register, 
    login, 
    logout, 
    refresh,
    getProfile, 
    verifyEmail, 
    forgotPassword, 
    resetPassword,
};