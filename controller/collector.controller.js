import { StatusCodes } from "http-status-codes";
import collectorModel from "../model/collector.model.js";
import { Collector } from "../assessories/collector.class.js";
import { Response } from "../assessories/response.class.js";
import validator from "validator";
import { uploads } from "../utility/cloudinary.js";





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
            
            const collector = new Collector(first_name, middle_name, last_name, email, phone, address);
            const existingCollector = await collector.getWithoutId(phone);
            if (existingCollector) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Collector already registered')
            }

            else{
                
                const cloud_collector_details = await uploads(req, 'Smart-Waste-Collector');
                const created_user = await collector.save(cloud_collector_details.url, cloud_collector_details.secure_url, cloud_collector_details.public_id);
               
                if (!created_user) {
                    return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error creating collector record this time')
                }

                return Response.successResponse(res, StatusCodes.CREATED, `Collector successfully created ..`, created_user)
            }
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
            const {params: {id}} = req;

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

           const {params: {id}, body: {middle_name, email}} = req;

            const updated_user = await collectorModel.findByIdAndUpdate({_id:id}, {...req.body}, {new: true});
            
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
                updated_user.email = email;
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
     * @property { String } req.params.id - CollectorID
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and deleted collector details
     */

    removeCollector = async(req, res) => {
        try {
            
            const {params: {id}} = req;

            const deleted_user = await collectorModel.findByIdAndDelete(id);
            if (deleted_user === null) {
                return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Collector already deleted');
            }

            if (!deleted_user) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Unable to delete collector this time');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Collector successfully deleted', deleted_user);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

}

export default new CollectorController();