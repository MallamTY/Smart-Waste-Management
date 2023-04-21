import registeredEmailModel from "../model/users.email.model.js";
import validator from "validator";
import {Response} from '../assessories/response.class.js';
import { StatusCodes } from "http-status-codes";
import { response } from "express";
import constainerModel from "../model/container.model.js";




class EmailController {
    constructor () {

    }

    createEmail = async(req, res) => {
        const {body: {location, volume}} = req;

        if (!location || !volume) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'All field is required');
        }

        const container = await constainerModel.create({location, volume});

        if (!container) {
            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Unable to register container this time, please try again');
        }

        return Response.successResponse(res, StatusCodes.CREATED, 'Email registered', container);
    }

    getAllContainer = async(req, res) => {
        try {
            
            const containers = await constainerModel.find();

            if (!containers) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'No container registered this time');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Emails found', containers);
        } catch (error) {
            Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    getSingleContainer = async(req, res) => {
        try {
            const {body: {id}} = req;

            const container = await constainerModel.findById(id);

            if (!container) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'container record not found');
            }
            
            return Response.successResponse(res, StatusCodes.OK, 'Container found ...', container);

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    updateContainer = async(req, res) => {
        try {
            const {body: {id, location, volume}} = req;

            if (!id || !(location && volume)) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Some required filed are ID and location and/or volume filed must be filled !!!')
            }

            const updatedContainer = await constainerModel.findByIdAndUpdate({_id:id}, {...req.body}, {new: true});

            if (!updatedContainer) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Unable to update container record this time');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Container record updated', updatedContainer);

        } catch (error) {
            Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }


    addObject = async (req, res) => {
        try {
            const {body: {container_id, object_volume}} = req;

            if (!container_id || !object_volume) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container ID and Object volume is required');
            }

            const container = await constainerModel.findById(container_id);

            if (!container) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container not found !!!')
            }

            const new_volume = container.volume_status + object_volume;
            const container_threshold = container.volume - (0.5 * container.volume);
            if (new_volume > container_threshold + 5) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container will be overfilled with this object');
            }

            else if (new_volume < container_threshold + 5) {
                container.volume_status = new_volume;
                await container.save();

                const container_threshold = container.volume - (0.5 * container.volume);
                if (container.volume_status === (container_threshold || container_threshold + 1 || container_threshold + 2)) {
                    
                    //Implement SMS notification to collector here.
                }
                return Response.successResponse(res, StatusCodes.OK, 'Object added to container ...', container);
            }
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    deleteContainer = async(req, res) => {
        try {
            
            const {body: {id}} = req;

            const deletedContainer = await registeredEmailModel.findByIdAndDelete(id);

            if (!deletedContainer) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Error deleting container !!!')
            }

            return Response.successResponse(res, StatusCodes.OK, 'Container deleted', deletedEmail);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}


export default new ContainerController();

