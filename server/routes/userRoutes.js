import express from "express"
import { getUserData, updateUserProfile } from "../controllers/userController.js";
import userAuth, { authMiddleware } from "../middleware/userAuth.js";
import { linkGoogle, unlinkGoogle } from "../controllers/authController.js";


const userRouter =express.Router();

userRouter.get('/data',userAuth,getUserData)
userRouter.put('/update-profile',userAuth,updateUserProfile)
userRouter.post("/link/google", authMiddleware, linkGoogle);
userRouter.post("/unlink/google", authMiddleware, unlinkGoogle);
    

export default userRouter;