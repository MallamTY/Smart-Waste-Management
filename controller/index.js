import userController from "./user.controller.js";
import collectorController from "./collector.controller.js";



const signUp = userController.SignUp;




const registerCollector = collectorController.registerCollector;
const getSingleCollector = collectorController.getSingleCollector;
const getAllCollector = collectorController.getAllCollector;
const updateCollector = collectorController.updateCollector;
const deleteCollector = collectorController.removeCollector;




export const UserController = {
    signUp
}


export const CollectorController = {
    registerCollector,
    getSingleCollector,
    getAllCollector,
    updateCollector,
    deleteCollector
}