import express from 'express';
import { CollectorController } from '../controller/index.js';
import { multerUploads } from '../services/multer.js';
import { Auth } from '../middleware/index.js';


const router = express.Router();



router.use(Auth.auth, Auth.userAuth); // user uthentication & authorization middleware to protect the routes;

router.post('/register', multerUploads, CollectorController.registerCollector);

router.get('/get-single', CollectorController.getSingleCollector);

router.get('/get-all', CollectorController.getAllCollector);

router.delete('/delete', CollectorController.deleteCollector);

router.put('/update', CollectorController.updateCollector);


export default router;
