import express from 'express';
import { CollectorController } from '../controller/index.js';
import { multerUploads } from '../services/multer.js';


const router = express.Router();

router.post('/register', multerUploads, CollectorController.registerCollector);

router.get('/get-single/:id', CollectorController.getSingleCollector);

router.get('/get-all', CollectorController.getAllCollector);

router.delete('/delete/:id', CollectorController.deleteCollector);

router.put('/update/:id', CollectorController.updateCollector);


export default router;
