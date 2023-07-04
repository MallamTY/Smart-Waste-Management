import registeredEmailModel from "../model/users.email.model.js";
import {Response} from '../assessories/response.class.js';
import { StatusCodes } from "http-status-codes";
import containerModel from "../model/container.model.js";
import teamModel from "../model/team.model.js";




class ContainerController {
    constructor () {

    }

    registerContainer = async(req, res) => {

       try {
        
        const {body: {location, volume, team, latitude, longitude}} = req;
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        if (!location || !volume) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'All field is required');
        }

        const db_container = await containerModel.findOne({location});

        if (db_container) {
            return Response.failedResponse(res, StatusCodes.CONFLICT, 'Container already register !!!');
        }
        const db_team = await teamModel.findOne({name: team});
        
        if (!db_team) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Team not registered yet');
        }
        const container = await containerModel.create({location, volume, team_responsible: db_team._id, location_link: url});

        if (!container) {
            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Unable to register container this time, please try again');
        }

        return Response.successResponse(res, StatusCodes.CREATED, 'Email registered', container);
        
       } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
       }
    }

    getAllContainer = async(req, res) => {
        try {
            
            const containers = await containerModel.find().sort({createdAt: 1}).populate('team');

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
            const {body: {container_id}} = req;

            const container = await containerModel.findById(container_id).populate('team');

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
            const {body: {container_id, location, volume, team}} = req;

            if (!container_id || (!location && !volume && !team)) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Some required filed like container_id and location, team and/or volume filed must be filled !!!')
            }
            
            if (team) {
                const db_team = await teamModel.findOne({name: team});
        
                if (!db_team) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Team not registered yet');
                }

            }
            const updatedContainer = await containerModel.findByIdAndUpdate({_id: container_id}, {team_responsible: team,...req.body}, {new: true});

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

            const container = await containerModel.findById(container_id);

            if (!container) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container not found !!!')
            }

            const new_volume = container.volume_status + object_volume;
            const container_threshold = container.volume - (0.5 * container.volume);
            if (new_volume > container_threshold) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container will be overfilled with this object');
            }

            else if (new_volume < container_threshold) {
                container.volume_status = new_volume;
                container.percentage_level = (new_volume/container.volume) * 100
                await container.save();

                const container_threshold = container.volume - (0.5 * container.volume);
                if (container.volume_status >= (container_threshold || container_threshold + 1 || container_threshold + 2)) {
                     //Implement SMS notification to collector here.

                     container.volume_status = 0;
                     container.percentage_level = 0;
                     container.filled_count += 1;
                     container.save();
                    return Response.successResponse(res, StatusCodes.OK, 'Container threshold reached and message has been sent to the team for evacuation', container);
                   
                }
                return Response.successResponse(res, StatusCodes.OK, 'Object added to container ...', container);
            }
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    deleteContainer = async(req, res) => {
        try {
            
            const {params: {container_id}} = req;

            const deletedContainer = await containerModel.findByIdAndDelete(container_id);

            if (!deletedContainer) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Error deleting container !!!')
            }

            return Response.successResponse(res, StatusCodes.OK, 'Container deleted', deletedContainer);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}


export default new ContainerController();

