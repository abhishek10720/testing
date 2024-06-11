import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(
    async function(req, res, next){
    try {
        //find(from cookies or header), validate and verify accessToken
                const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "")   //(Bearer _token)
                if(!token){
                    throw new ApiError(404, "invalid token")
                }
        
                const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        //find user with verified Token and set that user to req.userrrr
                const user = User.findById(decodedToken._id)?.select("-password -refreshToken")
                if(!user) throw new ApiError(401,"unauthorized user")
                req.user = user //custom method req.user
                next();
    } catch (error) {
            throw new ApiError(401, error.message||"something went wrong in verifyJWT")
    }
}
)

export {verifyJWT}
//This middleware helps to maintain secured routes. like- updateProfile, uploadVideos,etc
//this middleware will be used to pass the user data by verifying accesstoken. 
//Any req made by user will be checked with this middleware
//like, router.route("/updateProfile").post(verifyJWT, updatedProfile)