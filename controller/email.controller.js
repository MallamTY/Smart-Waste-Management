import registeredEmailModel from "../model/users.email.model.js";
import validator from "validator";
import {Response} from '../assessories/response.class.js';
import { StatusCodes } from "http-status-codes";
import { response } from "express";




class EmailController {
    constructor () {

    }

    createEmail = async(req, res) => {
        const {body: {email}} = req;

        if (!email) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Email field is required');
        }

        if (!validator.isEmail(email)) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Please enter a valid email address');
        }

        const existingEmail = await registeredEmailModel.findOne({email: email.toLowerCase()});

        if (existingEmail) {
            return Response.failedResponse(res, StatusCodes.CONFLICT, 'Email address already taken');
        }
        
        const registeredEmail = await registeredEmailModel.create({email});

        if (!registeredEmail) {
            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Unable to register email this time, please try again');
        }

        return Response.successResponse(res, StatusCodes.CREATED, 'Email registered', registeredEmail);
    }

    getAllEmail = async(req, res) => {
        try {
            
            const emails = await registeredEmailModel.find();

            if (!emails) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'No email registered this time');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Emails found', emails);
        } catch (error) {
            Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    getSingleEmail = async(req, res) => {
        try {
            const {body: {id}} = req;

            const email = await registeredEmailModel.findById(id);

            if (!email) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Email address not found');
            }
            
            return Response.successResponse(res, StatusCodes.OK, 'Email found ...', email);

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    deleteEmail = async(req, res) => {
        try {
            
            const {params: {id}} = req;

            const deletedEmail = await registeredEmailModel.findByIdAndDelete(id);

            if (!deletedEmail) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Error deleting email !!!')
            }

            return Response.successResponse(res, StatusCodes.OK, 'Email deleted', deletedEmail);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}


export default new EmailController();

