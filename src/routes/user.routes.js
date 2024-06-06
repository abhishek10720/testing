import { Router } from "express";
import { registeredUser } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
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
    
    
// router.route("/login").post(loginUser)



export default router;