import express from 'express';
import { UserController } from '../controller/index.js';
import { multerUploads } from '../services/multer.js';


const router = express.Router();


router.post('/signup', multerUploads, UserController.signUp);




export default router;