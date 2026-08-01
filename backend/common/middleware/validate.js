import ApiError from "../utils/ApiError.js";
// import BaseDto from "../dto/base.dto.js";


const validate = (Dtoclass)=>{  // checks if the req.body is as per the schema or not 
    return (req,res,next)=>{
        const{errors,value} = Dtoclass.validateData(req.body); // this 'validateData' is from baseDto 

        if(errors) throw ApiError.badRequest(errors.join("; "))

            req.body = value; // value-> contains value that are required only ,pass the only values that are required 

            next();
    }
}

export default validate 