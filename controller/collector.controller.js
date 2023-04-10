import { StatusCodes } from "http-status-codes";
import collectorModel from "../model/collector.model";





class CollectorController{

    constructor () {

    }
    /**
    * Method to creat collectors
    */

    createCollector = async(req, res) => {
        try {
            const {body: {first_name, middle_name, last_name, email, team, address, phone}} = req;
        
            if (!first_name ||middle_name || last_name || email || address || phone) {
               return res.status(StatusCodes.EXPECTATION_FAILED).json({
                    message: `failed`,
                    status: `All required fields must be filled`
                })
            }

            const existingCollector = await collectorModel.findOne({$or: [{email}, {username}]});
            
            if (existingUser) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    status: `failed`,
                    message: `Collector already registered`
                })
            }

            else{
                
                await uploads(req, 'Smart-Waste-Collector');
                return res.status(StatusCodes.CREATED).json({
                    status: `success`,
                    message: `Collector successfully created ..`
                })
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: `failed`,
                message: error.message
            })
        }

    }


        /**
         * Method to update a collector record
         */

        updateCollector = async(req, res) => {
            try {
                
                const {parmas: {id}} = req;

                const updateUser = await collectorModel.findByIdAndUpdate({_id:id}, {...req.body}, {new: true});

                if (!updateUser) {
                    return res.status(StatusCodes.FAILED_DEPENDENCY).json({
                        status: `failed`,
                        message: `Unable to update collector record this time`
                    })
                }
            } catch (error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: `failed`,
                    message: error.message
                })
            }
        }

}