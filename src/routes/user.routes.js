import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(registerUser); 
//When someone sends a POST request to http://localhost:8000/api/v1/users/register
//Run the registerUser function to handle the request.
export default router;
