import express from 'express';
import {AuthController} from '../controller/index.js';

const router = express.Router();


router.post('/login', AuthController.login);



export default router;
