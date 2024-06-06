class ApiError extends Error{
    //predefined props in error class in node js
    constructor(
        statuscode,
        message= "message is not specified",
        error =[],
        stack =""
    ){
        // super(message, statuscode, error, stack)
        super(message)
        this.statuscode = statuscode
        this.error = error
        this.success = false 
        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
        
    }
}


export {ApiError};