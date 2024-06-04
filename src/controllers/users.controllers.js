import {asyncHandler} from "../utils/asyncHandler.js";

const registeredUser = asyncHandler(
    (req, res, next)=>{
        res.status(200).json({
            message: "registeredUser success"
        })
    }
)

export {registeredUser};