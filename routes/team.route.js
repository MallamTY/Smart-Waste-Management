import express from 'express';
import teamController from '../controller/team.controller.js';

const router = express.Router();




router.post('/create', teamController.createTeam);

router.put('/add', teamController.addCollector);

router.put('/remove', teamController.removeCollector);

router.get('/get-single', teamController.getSingleTeam);

router.get('/get-all', teamController.getAllTeam);

router.put('/update', teamController.updatedTeam);

router.delete('/delete', teamController.deleteTeam);



export default router;