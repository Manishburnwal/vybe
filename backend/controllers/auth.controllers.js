import sendMail from "../config/Mail.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp=async(req,res)=>{
    try {
        const { name,userName, email, password } = req.body;
        const findByEmail=await User.findOne({ email });
        if(findByEmail){
            return res.status(400).json({ message: "Email already exists !" });
        }
        const findByUserName=await User.findOne({ userName });
        if(findByUserName){
            return res.status(400).json({ message: "UserName already exists !" });
        }
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long !" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            userName,
            email,
            password:hashedPassword
        });

        const token = await user.genToken();
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10*365*24*60*60*1000, // 10 years
            secure: false, // Set to true if using HTTPS
            sameSite: "Strict",
        });

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Sign Up error: ${error.message}` });
    }
}

export const signIn=async(req,res)=>{
    try {
        const { userName,password } = req.body;

        const user = await User.findOne({ userName });
        if(!user){
            return res.status(404).json({ message: "User not found !" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect Password !" });
        }

        const token = await user.genToken();
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10*365*24*60*60*1000, // 10 years
            secure: false, // Set to true if using HTTPS
            sameSite: "Strict",
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Sign In error: ${error.message}` });
    }
}

export const signOut=async(req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Sign out successfully !" });
    } catch (error) {
        return res.status(500).json({ message: `Sign out error: ${error.message}` });
    }
}

export const sendOtp=async(req,res)=>{
    try {
        const { email } = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({ message: "User not found !" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        user.isOtpVerified = false;
        await user.save();
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent successfully !" });

    } catch (error) {
        return res.status(500).json({ message: `Send OTP error: ${error.message}` });
    }
}

export const verifyOtp=async(req,res)=>{
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if(!user || user.resetOtp!==otp || user.otpExpires < Date.now()){
            return res.status(400).json({ message: "invalid/expired otp" });
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully !" });
    } catch (error) {
        return res.status(500).json({ message: `Verify OTP error: ${error.message}` });
    }
}

export const resetPassword=async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({ email });
        if(!user || !user.isOtpVerified){
            return res.status(400).json({ message: "Please verify your OTP first !" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false; // Reset OTP verification status
        await user.save();
        return res.status(200).json({ message: "Password reset successfully !" });
    } catch (error) {
        return res.status(500).json({ message: `Reset Password error: ${error.message}` });
    }
}

