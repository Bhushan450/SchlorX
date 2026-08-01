class ApiError extends Error{

    constructor(statuscode, message){
        super(message)
        this.statuscode=statuscode
        this.isOperational = true // this property commonly used to distinguish bwtn operational errors / programmming errors
        Error.captureStackTrace(this,this.constructor)
    }

    static badRequest(message="Bad Request"){
        return new ApiError(400,message);
    };

    static unauthorised(message="Unauthorised Request"){
        return new ApiError(401,message);
    };

    static notFound(message="User not found"){
        return new ApiError(404,message);
    };

    static conflict(message="Conflict!"){
        return new ApiError(409,message);
    };

    static forbidden(message="Forbidden"){
        return new ApiError(403,message);
    };
}

export default ApiError;