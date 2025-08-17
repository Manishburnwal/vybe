import express from 'express';
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/signup',signUp);
authRouter.post('/signin',signIn);
authRouter.get('/signout',signOut);
authRouter.post('/sendotp',sendOtp);
authRouter.post('/verifyotp',verifyOtp);
authRouter.post('/resetpassword',resetPassword);

export default authRouter;