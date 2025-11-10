import { google } from "googleapis";
import userModel from "../models/userModel.js";


export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        // console.log("userId:",userId);
        const user = await userModel.findById(userId);
        // console.log("user: ",user);

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                providers: { google: user.providers.google || null }
            }
        });
    } catch (error) {
        console.log(error.message);

        return res.json({ success: false, message: error.message })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, email, phone } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        await user.save();

        // console.log(user)

        return res.json({
            success: true, message: "Profile updated successfully", user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                providers: { google: user.providers.google || null }
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}