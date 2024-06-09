import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploaOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async function(userId){
    try {
        const user = await User.findById(userId)    //find user by id
        const AccessToken = await user.generateAccessToken(); //generate tokens for that user
        const RefreshToken = await user.generateRefreshToken();
        
        console.log(AccessToken, RefreshToken); //why are these undefined????   
        user.refreshToken = RefreshToken    //update and save refresh token (for more info refer to userschema )
        await user.save({ validateBeforeSave: false })
        
        return { AccessToken, RefreshToken }
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating token")
    }
}

const registeredUser = asyncHandler(
    async (req, res, next)=>{
//steps
//get users details from frontend
        const {email, username, fullname, password} = req.body    
  
//validation for all required feilds
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
}   )

const loginUser = asyncHandler(
    async(req, res, next)=>{
//frontend data
        const {email, username, password} = req.body; 
// console.log(email, username, password);------err.solution------> rawdata/json (not form data) inpostman
//username or email based login
        if(!username && !email){
            throw new ApiError(409, "username or email required")
        }

//find the user
        const user = await User.findOne({
            $or: [{email},{username}]
        })
        if(!user){
            throw new ApiError(404, "user not found")
        }

//password validation
        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            throw new ApiError(401, "invalid password")
        }

//generate refresh token and access token
        const {AccessToken, RefreshToken} = await generateAccessAndRefreshToken(user._id)

//send cookies
        const loggedinUser = await User.findById(user._id).select("-password -refreshToken")
        const options = {
            httpOnly: true,
            secure: true
        }
//console.log("tokens: ",AccessToken, RefreshToken);----------err.sol-->return token in userToken generating methods.
        return res.status(200)
        .cookie("access-token", AccessToken, options)
        .cookie("Refresh-token", RefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, AccessToken, RefreshToken
                },
                "User logged in successfully"
            )
        )
    }
)


export {registeredUser,loginUser};