import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app= express()

app.use(cors({   
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from './routes/user.routes.js'


// routes declaration
app.use("/api/v1/users",userRouter)         //http://locahost:8000/api/v1/users/register

export default app;




// 👉 What happens here?
// Creates an Express app.
// Adds middlewares (CORS, JSON parsing, cookie handling, etc.).
// Imports user routes (user.routes.js) and makes them available at /api/v1/users.