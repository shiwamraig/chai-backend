// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"  // then config for it to work properly
import connectDB from "./db/index.js";

import app from './app.js'
dotenv.config({
    path:'./env'
})



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!! ",err);
    
})

// 👉 What happens here?

// Loads environment variables from .env file.
// Connects to MongoDB using connectDB().
// If successful, starts the Express server (app.listen()).
// If MongoDB fails, it logs an error and doesn’t start the server.










// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

// import express from "express"
// const app = express()

// (async ()=>{

//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",()=>{
//             console.log("ERRR:",error);
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     }
//     catch(error){
//         console.log("ERROR:",error);
//         throw error
        
//     }
// })();










