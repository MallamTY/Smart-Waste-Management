import express from 'express';
import { UserController } from '../controller/index.js';
import { multerUploads } from '../services/multer.js';
import {Auth} from '../middleware/index.js'


const router = express.Router();


router.post('/signup', multerUploads, UserController.signUp);

router.get('/get-user', Auth.auth,UserController.getUser);

router.get('/get-all-user', Auth.auth, Auth.adminAuth,UserController.getAllUser);



export default router;