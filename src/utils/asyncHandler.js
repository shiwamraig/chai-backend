const asyncHandler =(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }

}

export {asyncHandler}

// In Express.js, when handling asynchronous operations (like database calls or external API requests), errors can occur. If an error is not properly handled, 
// it can cause the server to hang or crash.
// asyncHandler is supposed to take an asynchronous function (requestHandler) and return a new function that:

// 1. Executes requestHandler inside a Promise.resolve().
// 2. Catches any errors that occur and automatically passes them to Express’s next() function, which allows Express's built-in error handling middleware to 
// process the error.
// This approach eliminates the need to manually wrap every route handler in try-catch blocks.

//------------ ANOTHER APPROACH ---------------

// const asyncHandler = (fn)=>async (req, res,next)=>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

