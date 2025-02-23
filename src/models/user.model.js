import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // whenever you want to make any field searchable in an optimised way then make its index true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    get fullname() {
      return this.fullName;
    },
    set fullname(value) {
      this.fullName = value;
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//HASHING THE PASSWORD : Middleware to Hash Password Before Saving
userSchema.pre("save", async function (next) {
  // never user arrow functions here this it doesn't know this>?:????
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Method to Check If Password Is Correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // gives true or false whether the password is matched or not
};


//Method to Generate Access Token (JWT)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Purpose: Generates a short-lived access token (JWT) that allows the user to stay logged in.
// How it works:
// Takes the user's _id, email, username, and fullname.
// Signs them with a secret key (ACCESS_TOKEN_SECRET) stored in environment variables.
// The token expires after a set time (ACCESS_TOKEN_EXPIRY).



userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
          _id: this._id,
          email: this.email,
          username: this.username,
          fullname: this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
      );
};

// Purpose: Generates a refresh token, which is used to get a new access token without requiring a login.
// Works the same way as generateAccessToken, but it uses REFRESH_TOKEN_SECRET and has a longer expiration time.

export const User = mongoose.model("User", userSchema);
