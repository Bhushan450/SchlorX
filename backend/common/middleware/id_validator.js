import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

// this function validates the incoming Id's like - classId , teacherId etc are matching
// with mongodb objectId format or not 
const validateObjectIds = (...params) => {
    return (req, res, next) => {

        for (const param of params) {

            const id = req.params[param];

            // checks if the id in in mongoDB objectId format
            if (!mongoose.Types.ObjectId.isValid(id)) {  
                throw ApiError.badRequest(`Invalid Id: ${param}`);
            }
        }
        next();
    };
};

export default validateObjectIds;