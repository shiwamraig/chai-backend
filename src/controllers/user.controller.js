import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import{ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken= async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken //This assigns the newly generated refreshToken to the refreshToken field of the user object.
        await user.save({validateBeforeSave:false})
        //await user.save() → Saves the updated user in the database.
// { validateBeforeSave: false } → Skips validation checks before saving.
// 💡 Why use validateBeforeSave: false?
// Normally, Mongoose validates all fields before saving. But since we are only updating the refreshToken, we don’t need full validation, so we disable it.

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating tokens");
    }
}
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


// if(fullName===""){
//     throw new ApiError(400,"Full Name is required");
// }

if(
    [fullName,email,username,password].some((field)=>field?.trim()==="") //?. is optional chaining, meaning if field is undefined or null, it won't cause an error and will return undefined instead
){
    throw new ApiError(400,"All fields are required");
}

const existedUser = await User.findOne({ //.findOne({...}) is a MongoDB query that searches for one document (user) in the User collection. The query searches for a user with the same username or email as the one sent from the frontend.
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] //$or is a MongoDB operator that means "match if at least one of these conditions is true."
})


if(existedUser){
    throw new ApiError(409,"User already exists");
}

//console.log("req.files: ",req.files);
const avatarLocalPath=req.files?.avatar[0].path; 
//req.files contains the files uploaded by the user
//  [0] means we take the first uploaded file if multiple files were uploaded.
// .path gets the location of the file in the system.
const coverImageLocalPath=req.files?.coverImage[0].path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required");
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;


if(!avatar){
    throw new ApiError(400,"Avatar is required");
}

const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || " "
});


const createdUser = await User.findById(user._id).select("-password -refreshToken") || user;

//User.findById(user._id) searches for the newly created user in the database using their unique ID (_id).
//.select("-password -refreshToken") removes the password and refresh token from the retrieved user data so they aren’t sent back in the response (for security reasons).

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
}

return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully")) 
//res.status(201) → Sends an HTTP status 201 (Created) to indicate the user was successfully registered.
// new ApiResponse(200, createdUser, "User registered successfully") →
// 200 → Success status.
// createdUser → The user details (without password and refresh token).
// "User registered successfully" → A message for the frontend.



});

const loginUser = asyncHandler(async (req, res) => {
//req body -> data
//username or email
//find the user
//password check
//access and refresh token
//send cookie
//return response

const { email,username, password } = req.body;

if(!email && !username){
    throw new ApiError(400,"Email or Username is required");
}

const user = await User.findOne({
    $or:[{username},{email}]
})

if(!user){
    throw new ApiError(404,"User not found");
}

const isPasswordValid = await user.isPasswordCorrect(password);

if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials");
}

const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)// since user has _id,username,email etc.

const loggedInUser = await User.findById(user._id).select("-password -refreshToken") ; 
//.select() function lets us choose which fields to include or exclude when retrieving data from the database.
//The hashed password (password) and refresh token (refreshToken) are sensitive and should never be sent to the frontend.

const options = {
    httpOnly:true, 
    secure:true   
}
//  Option	         Purpose	                                        Protection Against
// httpOnly: true	 Blocks JavaScript from accessing the cookie	    XSS (Cross-Site Scripting)
// secure: true	     Sends the cookie only over HTTPS	                MITM (Man-in-the-Middle attacks)

return res
.status(200)
.cookie("accesstoken",accessToken,options)
.cookie("refreshtoken",refreshToken,options)
.json(//The .json(...) method sends a JSON response (a structured data format).It wraps the data inside an ApiResponse object.
    new ApiResponse(
        200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
)
)
});

const logoutUser = asyncHandler(async (req, res) => {

await User.findByIdAndUpdate(req.user._id,  // #####  req.user contains the user data from the verifyJWT middleware.
    {
       $set:{
        refreshToken:undefined // removing it from the database.`
       }
    },
    {
        new:true // ensures that the updated user data is returned instead of the old one.
    }
)

const options = {
    httpOnly:true,
    secure:true
}

return res
.status(200)
.clearCookie("accesstoken",options)
.clearCookie("refreshtoken",options)
.json(new ApiResponse(200,{},"User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
const incomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken 

if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized request");

}

try {
    const decodedtoken =jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    
     const user = await User.findById(decodedtoken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token");
        }
    
    if(incomingRefreshToken!==user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used");
    }
    
    const options = {
        httpOnly: true,
        secure: true,
      };
    
    const {accessToken,newrefreshToken}   =await generateAccessAndRefreshToken(user._id);
    
    return res
      .status(200)
      .cookie("accesstoken", accessToken, options)
      .cookie("refreshtoken", newrefreshToken, options)
      .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newrefreshToken},
            "Access token refreshed successfully")
        );
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token");
    
}








});

export { registerUser,loginUser,logoutUser,refreshAccessToken };