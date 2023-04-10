import UserRoute from './user.route.js';
import express from 'express';

const router = express.Router();



router.use('/user', UserRoute);



export default router;

