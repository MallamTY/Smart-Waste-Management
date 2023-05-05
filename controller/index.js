import userController from "./user.controller.js";
import collectorController from "./collector.controller.js";
import teamController from "./team.controller.js";
import authController from "./auth.controller.js";
import emailController from "./email.controller.js";
import containerController from "./container.controller.js";


// Users endpoints controller

const signUp = userController.SignUp;
const getUser = userController.getUser;
const getAllUser = userController.getAllUser;



// Authentication Controllers

const login = authController.Login;
const verifyAccount = authController.verifyAccount;
const uploadProfilePicture = authController.uploadProfilePicture;
const resendOTP = authController.resendOTP;
const forgetPassword = authController.forgetPassword;
const resetPassword = authController.resetPassword;
const updateUserProfile = authController.updateUserProfile;
const updateProfilePicture = authController.updateProfilePicture;


// Container Controllers

const registerContainer = containerController.registerContainer;
const getAllContainer = containerController.getAllContainer;
const getSingleContainer = containerController.getSingleContainer;
const updateContainer = containerController.updateContainer;
const addObject = containerController.addObject;
const deleteContainer = containerController.deleteContainer;



// Email Controller

const createEmail = emailController.createEmail;
const getSingleEmail = emailController.getSingleEmail;
const getAllEmail = emailController.getAllEmail;
const deleteEmail = emailController.deleteEmail;

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
    signUp,
    getUser,
    getAllUser
}


export const AuthController = {
    login,
    verifyAccount,
    uploadProfilePicture,
    resendOTP,
    forgetPassword,
    resetPassword,
    updateUserProfile,
    updateProfilePicture
}


export const ContainerController = {
    registerContainer,
    getAllContainer,
    getSingleContainer,
    updateContainer,
    addObject,
    deleteContainer
}


export const EmailController = {
    createEmail,
    getSingleEmail,
    getAllEmail,
    deleteEmail
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