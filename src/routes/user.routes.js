import { Router } from "express";
import { registeredUser } from "../controllers/users.controllers.js";
const router = Router();
console.log('user.router.js');

// users/register
router.route("/register").post(registeredUser)
// router.route("/login").post(loginUser)



export default router;