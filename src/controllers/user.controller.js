import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import{ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {  //If anything goes wrong inside our function (like a database error),asyncHandler will catch the error automatically, so our app doesn't crash.
// get user details from frontend
// validation - not empty
// check if user already exits :  username,email
// check for images,check for avatar
// upload them to cloudinary , avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation 
// return response

const {fullName, email,username,password}= req.body //req.body contains the data sent from the frontend (or Postman) in a request.--> The code extracts the values (email, fullName, etc.) from req.body.
console.log("email: ",email);

// if(fullName===""){
//     throw new ApiError(400,"Full Name is required");
// }

if(
    [fullName,email,username,password].some((field)=>field?.trim()==="") 
){
    throw new ApiError(400,"All fields are required");
}

const existedUser = User.findOne({
    $or:[{username},{email}]
})

if(existedUser){
    throw new ApiError(409,"User already exists");
}

const avatarLocalPath=req.files?.avatar[0].path;
const coverImageLocalPath=req.files?.coverImage[0].path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required");
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"Avatar is required");
}

const user = User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || " ",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser=User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
}

return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully")) 
























});
export { registerUser };

// 👉 What happens here?


// Defines the registerUser function.
// Sends { "message": "ok" } back to the user.
// Uses asyncHandler to catch errors.