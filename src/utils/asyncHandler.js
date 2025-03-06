const asyncHandler =(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))//. Express does NOT catch errors from async functions automatically!
    }

}

export {asyncHandler}

// This function:

// Takes another function (requestHandler) as an argument.
// Returns a new function that takes (req, res, next), which are standard Express middleware parameters.
// Executes requestHandler inside Promise.resolve() to handle both synchronous and asynchronous operations.
// If requestHandler throws an error, .catch(next) automatically forwards it to Express error-handling middleware instead of crashing the app.


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

// 🔹 Why Do We Need a Promise Here?
// In Express, route handlers can be synchronous or asynchronous.

// Synchronous functions return a value directly.
// Asynchronous functions return a Promise (e.g., functions using async/await).
// Since asynchronous functions might fail, we need a way to catch errors automatically and forward them to Express's error-handling middleware.

//-------SUMMARY-------
// Express does not automatically catch errors in async functions.
// Without Promises, unhandled errors inside async functions can crash the app.
// Promise.resolve() ensures all functions (sync or async) are handled correctly.
// asyncHandler automatically catches errors and forwards them to Express's error middleware.
