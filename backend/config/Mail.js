import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASS // Your email password
    },
});

const sendMail= async (to,otp)=>{
    await transporter.sendMail({
        from: `${process.env.EMAIL}`, // sender address
        to,
        subject: "Reset Password OTP",
        html: `<p>Your OTP for resetting your password is <b>${otp}</b>. It expires in 5 minutes...</p>`,
    })
}

export default sendMail;
