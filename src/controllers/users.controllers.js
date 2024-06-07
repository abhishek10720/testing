import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploaOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registeredUser = asyncHandler(
    async (req, res, next)=>{
//steps
//get users details from frontend
        const {email, username, fullname, password} = req.body    
  
//validation
        // if(fullname === "") throw new ApiError //and do same for each feilds or use .some() method
        if([email, username, fullname, password].some((field) => !field || field?.trim() === ""))
            {
                throw new ApiError(400, "All feilds are required")
            }
            
//check if user already exists: email, username *check-both-parameters by $or operator
        // import user model
        const existeduser = await User.findOne({
            $or :[{ email }, { username }]
        });
        //console.log(existeduser);
        if(existeduser) {throw new ApiError(409,"Username or email already registered"); }
        
//check images, avatar uploaded?---> from local path
        const avatarLocalPath = req.files?.avatar?.[0]?.path
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path

        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar is required")
        }
        
//upload to cloudinary----> pass localpaths to cloudinary
        const avatar = await uploaOnCloudinary(avatarLocalPath)
        const coverImage = await uploaOnCloudinary(coverImageLocalPath)
        if(!avatar){
            throw new ApiError(400, "AvatarLocalPath is required")
        }

//now create user object in database
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",   //if coverImage url not exits let it be empty string.
            email,
            password,
            username: username.toLowerCase()
        })

//remove password and refresh token field from response------------using .select() method.
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
// console.log(createdUser);
//check user creation 
        if(!createdUser) throw new ApiError(500, "something went wrong while user creation")    //server error

//return response
        return res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully"))
    })

export {registeredUser};