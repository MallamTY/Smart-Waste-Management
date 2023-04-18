import express from 'express';
import { CollectorController } from '../controller/index.js';
import { multerUploads } from '../services/multer.js';
import UserAuthorization from '../middleware/verifyUser.js';
import Authentication from '../middleware/auth.js';


const router = express.Router();

router.use(Authentication, UserAuthorization)

router.post('/register', multerUploads, CollectorController.registerCollector);

router.get('/get-single', CollectorController.getSingleCollector);

router.get('/get-all', CollectorController.getAllCollector);

router.delete('/delete', CollectorController.deleteCollector);

router.put('/update', CollectorController.updateCollector);


export default router;
