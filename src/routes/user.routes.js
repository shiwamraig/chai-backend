import { Router } from "express";
import { registerUser ,loginUser ,logoutUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1},
        {name: "coverImage", maxCount: 1}
    ]),
    registerUser); 

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
// Before running logoutUser function, the middleware verifyJWT ensures that the user is logged in.
// If the user has a valid token, they can log out.
// If the user doesn’t have a valid token, access is denied (401 Unauthorized).
router.route("/refresh-token").post(refreshAccessToken);




//When someone sends a POST request to http://localhost:8000/api/v1/users/register
//Run the registerUser function to handle the request.
export default router;


// Final Example (Real-World Analogy)
// Logging in (/login) → Like entering a secured building and getting an entry pass (JWT token).
// Trying to log out (/logout) → The system checks your entry pass first (verifyJWT).
// If you have a valid pass, you can exit (logout).
// If you don’t have a pass, security stops you (Unauthorized error).
// This ensures only logged-in users can log out, preventing security loopholes. 