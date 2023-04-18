import UserRoute from './user.route.js';
import CollectorRoute from './collector.route.js';
import TeamRoute from './team.route.js';
import AuthRoute from './auth.route.js';
import express from 'express';



const router = express.Router();



router.use('/user', UserRoute);

router.use('/collector', CollectorRoute);

router.use('/team', TeamRoute);

router.use('/auth', AuthRoute);



export default router;

