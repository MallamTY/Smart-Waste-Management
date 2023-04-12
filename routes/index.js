import UserRoute from './user.route.js';
import CollectorRoute from './collector.route.js';
import express from 'express';

const router = express.Router();



router.use('/user', UserRoute);

router.use('/collector', CollectorRoute);



export default router;

