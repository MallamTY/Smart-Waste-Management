import express from 'express';
import {AuthController} from '../controller/index.js';
import authController from '../controller/auth.controller.js';

const router = express.Router();


router.post('/login', AuthController.login);

router.put('/resent-verification-link/:token');

router.post('/verify/otp', AuthController.verifyOTP);

router.post('/resend-otp', AuthController.resendOTP);

router.post('/forget-password', AuthController.forgetPassword);

router.put('/reset-password/:toke', AuthController.resetPassword);

router.put('update-user-profile', AuthController.updateUserProfile);

router.put('/update-profile-picture', AuthController.updateProfilePicture);



export default router;
