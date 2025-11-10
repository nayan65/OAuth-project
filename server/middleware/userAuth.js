import jwt, { decode } from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        // console.log("token not found");

        return res.json({ success: false, message: " Not Authorized. Login Again" })
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id

        } else {
            return res.json({ success: false, message: "Not Authorized. Login Again failed" })
        }

        next();
    } catch (error) {
        console.log("jwt message", error.message);

        res.json({ success: false, message: error.message })
    }
}

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "Session Expired. Please log in again." });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // decoded should include { id, iat, exp }
        // console.log("token decode: ",decoded)
        const user = await userModel.findById(decoded.id);
        // console.log("user authmiddleware: ", user)
        if (!user) return res.status(401).json({ success: false, message: "User not found" });

        // attach both decoded and user info
        req.user = { ...decoded, user };

        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};


export default userAuth;