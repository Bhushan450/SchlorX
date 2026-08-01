import joi from "joi"

class BaseDto {

    static schema = joi.object({});

    static validateData(data){
        const{error,value} = this.schema.validate(data,{ // takes schema and validate 
            abortEarly:false,
            stripUnknown:true,
        });

        if(error)
        {
            const errors = error.details.map((detail)=>{ return detail.message})
            return {errors , value:null}
        }

        return {errors:null , value }
   }
}

export default BaseDto;