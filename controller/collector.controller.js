import { StatusCodes } from "http-status-codes";
import collectorModel from "../model/collector.model.js";
import { Collector } from "../assessories/collector.class.js";
import { Response } from "../assessories/response.class.js";
import validator from "validator";
import { uploads } from "../utility/cloudinary.js";
import teamModel from "../model/team.model.js";





class CollectorController{

    constructor () {

    }
    /**
    * Method to create collectors
    */

    registerCollector = async(req, res) => {
        try {
            const {body: {first_name, middle_name = "", last_name, email = "", address, phone}} = req;

            if (email && !validator.isEmail(email)) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid email format supplied`)
            }
            if (!first_name || !last_name || !address || !phone) {
               return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    message: `failed`,
                    status: `All required fields must be filled`
                })
            }
            
            const collector = new Collector(first_name, middle_name, last_name, email.toLowerCase(), phone, address);

            const existingCollector = await collector.getWithoutId(phone);

            if (existingCollector) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Collector already registered')
                
            }

            if (existingCollector && email.toLowerCase() === collector.email) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Email already taken')
            }

        
                
                const cloud_collector_details = await uploads(req.body, 'Smart-Waste-Collector');
                const created_user = await collector.save(cloud_collector_details.url, cloud_collector_details.secure_url, cloud_collector_details.public_id);
               
                if (!created_user) {
                    return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error creating collector record this time')
                }
                
                return Response.successResponse(res, StatusCodes.CREATED, `Collector successfully created ..`, created_user);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }

    }

    /**
     * Get Collector Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property { String } req.params.id - CollectorID
     * @returns   { JSON } - A JSON object representing the status, statusCode, message, and collector
     */


    getSingleCollector = async(req, res) => {
        try {
            const {body: {id}} = req;

            const collector = await collectorModel.findById(id);

            if (!collector) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Collector not found');
            }
            
            return Response.successResponse(res, StatusCodes.OK, 'User found', collector);

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    /**
     * Get Collector Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property { String } req.params.id - CollectorID
     * @returns   { JSON } - A JSON object representing the staus, statusCode, message, array of colletor objects
     */

    
    getAllCollector = async(req, res) => {
        try {
            
            const collectors = await collectorModel.find();

            if (!collectors) {
                return Response.failedResponse(res, StatusCodes.OK, 'No COllector in the database currently')
            }

            return Response.successResponse(res, StatusCodes.OK, 'Collectors found', collectors);

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }


      /**
     * Update Collector Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property { String } req.params.id - CollectorID
     * @property {Object} req.body - Collector properties to be updated
     * @returns   { JSON } - A JSON object representing the status, statusCode, message, and updated collector
     */

  
   
    updateCollector = async(req, res) => {
        try {

           const {body: {collector_id, middle_name, email}} = req;

            const updated_user = await collectorModel.findByIdAndUpdate({_id: collector_id}, {...req.body}, {new: true});
            
            if (!updated_user) {
                Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error updating collector record this time');
            }
            if (middle_name) {
                updated_user.middle_name = middle_name;
                updated_user.save();
            }
            if (email) {
                if (!validator.isEmail(email)) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid email format supplied`);
                }
                updated_user.email = email.toLowerCase();
                updated_user.save();
                
            }

            return Response.successResponse(res, StatusCodes.OK, 'Collector record updated', updated_user)
            

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }




     /**
     * Delete Collector Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property { String } req.params.id - CollectorI
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and deleted collector details
     */

    removeCollector = async(req, res) => {
        try {
            
            const {body: {collector_id}} = req;

            const db_collector = await collectorModel.findById(collector_id);

            if (db_collector.team) {
                const team = await teamModel.findById(db_collector.team);
                console.log(team.member.includes(collector_id))
                if (!team) {
                    return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error obtaining team details this');
                }
                
                if (team.leader1 !== null) {
                    if (team.leader1.toString() === collector_id) {
            
                        const updated_team = await teamModel.findByIdAndUpdate({_id: db_collector.team}, {$unset: {leader1: ""}}, {new: true});
       
                        if (!updated_team) {
                            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting collector this time, please try again !!!');
                        }
                        const deleted_collector = await collectorModel.findOneAndDelete({_id: collector_id});

                        if (!deleted_collector) {
                            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting collector this time, please try again !!!');
                        }

                        return Response.successResponse(res, StatusCodes.OK, 'Collector successfully deleted', deleted_collector);

                    }

                }

                else if (team.leader2 !== null) {
                    if (team.leader2.toString() === collector_id) {

                        const updated_team = await teamModel.findByIdAndUpdate({_id: db_collector.team}, {$unset: {leader2: ""}}, {new: true});
        
                        if (!updated_team) {
                            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting collector this time, please try again !!!');
                        }
                        const deleted_collector = await collectorModel.findOneAndDelete({_id: collector_id});
        
                        if (!deleted_collector) {
                            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting collector this time, please try again !!!');
                        }
        
                        return Response.successResponse(res, StatusCodes.OK, 'Collector successfully deleted', deleted_collector);
                       }
                }
                
                
                else if (team.member.includes(collector_id)) {
                    console.log(team.member.includes(collector_id));
                    if (team.member.length === 1) {
                        const updated_team = await teamModel.findByIdAndUpdate({_id: team.id}, {$unset: {member: []}}, {new: true});
    
                        const deleted_collector = await collectorModel.findOneAndDelete({_id: collector_id});

                        if (!deleted_collector) {
                            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting collector this time, please try again !!!');
                        }
    
                        return Response.successResponse(res, StatusCodes.OK, 'Collector successfully removed', deleted_collector    );
                    }
    
                    else if (team.member.length > 1) {
                        const updated_team = await teamModel.findByIdAndUpdate({_id: team.id}, {$pull: {member: collector_id}}, {new: true});
    
                        const deleted_collector = await collectorModel.findOneAndDelete({_id: collector_id});

                        if (!deleted_collector) {
                            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting collector this time, please try again !!!');
                        }

                        return Response.successResponse(res, StatusCodes.OK, 'Collector successfully removed', deleted_collector);
                    }

                }
            }

            const deleted_collector = await collectorModel.findOneAndDelete({_id: collector_id});

            if (!deleted_collector) {
                return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting collector this time, please try again !!!');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Collector successfully removed', deleted_collector);

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

}

export default new CollectorController();