import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { oauth2Client } from "../utils/googleConfig.js";
import userModel from "../models/userModel.js";
import "dotenv/config"

//register user
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {
        //check the user already exist or not
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exist" })
        }
        //hashed password
        const hashedPassword = await bcrypt.hash(password, 10)
        //create new user
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save(); //save the new user in db

        return res.json({ success: true, message: "User created sucessfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" })
    }

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Email or Password is incorrect" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Email or Password is incorrect" })
        }

        //jwt token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
        // console.log(token);

        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        })

        return res.json({ success: true, message: "login sucessfull" })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "login failed" })
    }
}

export const googlelogin = async (req, res) => {
    // Logic for Google OAuth login
    try {
        const { code } = req.body;
        // console.log(code)
        const googleres = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleres.tokens);

        const userRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${googleres.tokens.access_token}`, {
            headers: {
                Authorization: `Bearer ${googleres.tokens.access_token}`
            }
        });
        const userData = await userRes.json();
        // console.log(userData);
        const { id: googleId, email, name, picture } = userData;
        // console.log(userData)
        // console.log(googleId)
        // console.log(email,name,picture);
        let user = await userModel.findOne({ "providers.google.id": googleId });

       
        if (!user) {
            user = await userModel.findOne({ email });
            if (user) {
                // If found by email, link Google automatically
                user.providers.google = {
                    id: googleId,
                    email,
                    linkedAt: new Date(),
                };
                await user.save();
            }
        }

        if (!user) {
            user = await userModel.create({
                name,
                email,
                password: code,
                providers: {
                    google: { id: googleId, email, linkedAt: new Date() },
                },
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
        // console.log("jwt:",token);

        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        })
        return res.json({ success: true, message: "login sucessfull", userData: userData })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "login failed" })
    }
}

export const linkGoogle = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id; // from your auth middleware (JWT cookie)
        const googleres = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleres.tokens);

        const userRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${googleres.tokens.access_token}`, {
            headers: {
                Authorization: `Bearer ${googleres.tokens.access_token}`
            }
        });

        const googleData = await userRes.json();
        const { id: googleId, email } = googleData;

        // Prevent linking a Google account already used by someone else
        const existingUser = await userModel.findOne({ "providers.google.id": googleId });
        if (existingUser && existingUser._id.toString() !== req.user.id) {
            return res.json({ success: false, message: "Google account is already linked to another user." });
        }

        const user = await userModel.findById(userId);
        user.providers.google = { id: googleId, email, linkedAt: new Date() };
        await user.save();

        res.json({ success: true, message: "Google account linked successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to link Google account" });
    }
};


export const unlinkGoogle = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        // Check re-auth freshness
        // if (!req.user.recentAuth) {
        //     return res.status(403).json({ success: false, message: "Re-authentication required" });
        // }

        if (!user.providers.google) {
            return res.json({ success: false, message: "No Google account linked." });
        }

        user.providers.google = null;
        await user.save();

        res.json({ success: true, message: "Google account unlinked successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error unlinking Google account" });
    }
};


//logout
export const logout = async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        })
        return res.json({ success: true, message: "logout sucessfull" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//check is auth
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}