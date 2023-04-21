import { EmailController } from "../controller/index.js";
import express from 'express';
import { Auth } from "../middleware/index.js";


const router = express.Router();

router.use(Auth.auth, Auth.adminAuth); // Admin authentication & authorization middleware to protect the routes

router.post('/create', EmailController.createEmail);

router.get('/get-single', EmailController.getSingleEmail);

router.get('/get-all', EmailController.getAllEmail);

router.delete('/delete', EmailController.deleteEmail);


export default router;
