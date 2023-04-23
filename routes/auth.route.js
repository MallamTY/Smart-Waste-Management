import express from 'express';
import {AuthController} from '../controller/index.js';
import { Auth } from '../middleware/index.js';
import { multerUploads } from '../services/multer.js';

const router = express.Router();


router.post('/login', AuthController.login);

router.put('/verify-account/:user_id', AuthController.verifyAccount);

router.post('/resend-otp', AuthController.resendOTP);

router.post('/forget-password', AuthController.forgetPassword);

router.put('/reset-password/:token', AuthController.resetPassword);

router.use(Auth.auth, Auth.userAuth); // Authentication middleware to protect the routes

router.post('/upload-profile-picture', multerUploads, AuthController.uploadProfilePicture);

router.put('/update-user-profile', AuthController.updateUserProfile);

router.put('/update-profile-picture', multerUploads, AuthController.updateProfilePicture);



export default router;
