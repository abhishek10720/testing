import { Router } from "express";
import { registeredUser, loginUser, logOutUser } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";     // to find the current user
const router = Router();

// users/register
router.route("/register").post( upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]), registeredUser)
    
router.route("/login").post(loginUser)

//secured Routes
router.route("/logout").post(verifyJWT, logOutUser)   //verify which user to log out then --> logout that user



export default router;