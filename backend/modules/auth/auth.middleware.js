import ApiError from "../../common/utils/ApiError.js";
import { verifyAccessToken } from "../../common/utils/jwt.js"
import User from "./auth.model.js"

const authenticate = async (req,res,next)=>{

    let token;

    if(req.headers.authorization?.startsWith("Bearer "))
    {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) throw ApiError.unauthorised("not authenticated");
    const decoded = verifyAccessToken(token);
    if(!decoded) throw ApiError.unauthorised("Invalid or expired token")

    const user = await User.findById(decoded._id);
    if(!user) throw ApiError.notFound("User no longer Exits");

    req.user ={
        id:user._id,  
        role:user.role,
        name: user.name,
        email: user.email,
    };
    next();
};

// checks for the roles (role based access control)
const authorize = (...roles)=>{
        return (req,res,next)=>{
            if(!roles.includes(req.user.role))
                {
                    throw ApiError.forbidden("You do not have permission to perform this action ")  ; 
                }
            next();
        };
    };

export {
    authenticate,
    authorize,
}
