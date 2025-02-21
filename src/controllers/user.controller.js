import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {  //If anything goes wrong inside our function (like a database error),asyncHandler will catch the error automatically, so our app doesn't crash.





});

export { registerUser };

// 👉 What happens here?


// Defines the registerUser function.
// Sends { "message": "ok" } back to the user.
// Uses asyncHandler to catch errors.