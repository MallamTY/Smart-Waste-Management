import express from 'express';
import {AuthController} from '../controller/index.js';
import { Auth } from '../middleware/index.js';

const router = express.Router();


router.post('/login', AuthController.login);

router.put('/verify-email', AuthController.verifyEmail);

router.put('/resent-verification-link/:token');

router.post('/verify/otp', AuthController.verifyOTP);

router.post('/resend-otp', AuthController.resendOTP);

router.post('/forget-password', AuthController.forgetPassword);

router.put('/reset-password/:token', AuthController.resetPassword);

router.use(Auth.auth, Auth.adminAuth); // Authentication middleware to protect the routes

router.put('update-user-profile', AuthController.updateUserProfile);

router.put('/update-profile-picture', AuthController.updateProfilePicture);



export default router;
