import { Router } from "express";
import { googlelogin, isAuthenticated, login, logout, register } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter=Router();

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/google",googlelogin);
authRouter.get("/is-Auth",userAuth,isAuthenticated);

export default authRouter