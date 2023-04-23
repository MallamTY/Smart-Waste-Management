import {ContainerController} from '../controller/index.js';
import { Auth } from '../middleware/index.js';
import express from 'express';

const router = express.Router();


router.use(Auth.auth, Auth.userAuth);

router.post('/register', ContainerController.registerContainer);

router.get('/get-single', ContainerController.getSingleContainer);

router.get('/get-all', ContainerController.getAllContainer);

router.put('/add-object', ContainerController.addObject);

router.put('/update', ContainerController.updateContainer);

router.delete('/delete', ContainerController.deleteContainer);


export default router;

