import userController from "./user.controller.js";
import collectorController from "./collector.controller.js";
import teamController from "./team.controller.js";
import authController from "./auth.controller.js";


// Users endpoints controller

const signUp = userController.SignUp;



// Authentication Controllers

const login = authController.Login;

// Collectors endpoints controllers

const registerCollector = collectorController.registerCollector;
const getSingleCollector = collectorController.getSingleCollector;
const getAllCollector = collectorController.getAllCollector;
const updateCollector = collectorController.updateCollector;
const deleteCollector = collectorController.removeCollector;



// Team endpoints controller

const createTeam = teamController.createTeam;
const addCollector = teamController.addCollector;
const removeCollector = teamController.removeCollector;
const getSingleTeam = teamController.getSingleTeam;
const getAllTeam = teamController.getAllTeam;
const updatedTeam = teamController.updatedTeam;
const deleteTeam = teamController.deleteTeam;




export const UserController = {
    signUp
}

export const AuthController = {
    login,
}

export const CollectorController = {
    registerCollector,
    getSingleCollector,
    getAllCollector,
    updateCollector,
    deleteCollector
}

export const TeamController = {
    createTeam,
    addCollector,
    removeCollector,
    getSingleTeam,
    getAllTeam,
    updatedTeam,
    deleteTeam
    
}