import express from 'express';
import { UserController } from '../controller/index.js';
import { multerUploads } from '../services/multer.js';
import {Auth} from '../middleware/index.js'


const router = express.Router();


router.post('/signup', multerUploads, UserController.signUp);

router.get('/get-single', Auth.auth,UserController.getUser);

router.get('/get-all', Auth.auth, Auth.adminAuth,UserController.getAllUser);



export default router;