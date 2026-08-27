import ApiError from "../../common/utils/ApiError.js";
import { verifyAccessToken } from "../../common/utils/jwt.js"
import User from "./auth.model.js"

const authenticate = async (req, res, next) => {

    let token;

    console.log("========== AUTHENTICATE ==========");
    console.log(
        "Authorization header:",
        req.headers.authorization
    );

    console.log(
        "Cookie accessToken exists:",
        !!req.cookies?.accessToken
    );

    if (req.headers.authorization?.startsWith("Bearer ")) {

        token = req.headers.authorization.split(" ")[1];

        console.log("Token received from Authorization header");
    }
    else if (req.cookies?.accessToken) {

        token = req.cookies.accessToken;

        console.log("Token received from cookie");
    }

    console.log("Token exists:", !!token);

    if (!token) {
        console.log("❌ NO TOKEN FOUND");
        throw ApiError.unauthorised("not authenticated");
    }

    console.log("Token:", token);

    const decoded = verifyAccessToken(token);

    console.log("Decoded token:", decoded);

    if (!decoded) {
        console.log("❌ TOKEN INVALID OR EXPIRED");
        throw ApiError.unauthorised(
            "Invalid or expired token"
        );
    }

    const user = await User.findById(decoded._id);

    console.log("Database user:", user);

    if (!user) {
        throw ApiError.notFound(
            "User no longer exists"
        );
    }

    req.user = {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        classAssigned: user.classAssigned,
    };

    console.log("Authenticated user:", req.user);
    console.log("=================================");

    next();
};

// checks for the roles (role based access control)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.forbidden("You do not have permission to perform this action ");
        }
        next();
    };
};

export {
    authenticate,
    authorize,
}
