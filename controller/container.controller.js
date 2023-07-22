
import {Response} from '../assessories/response.class.js';
import { StatusCodes } from "http-status-codes";
import containerModel from "../model/container.model.js";
import teamModel from "../model/team.model.js";
import { sendFilledContainer } from '../utility/emailSender.js';
import { smsSender } from '../utility/smsService.js';




class ContainerController {
    constructor () {

    }

    registerContainer = async(req, res) => {

       try {
        
        const {body: {location, volume, latitude, longitude}} = req;
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        if (!location || !volume) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'All field is required');
        }

        const db_container = await containerModel.findOne({location});

        if (db_container) {
            return Response.failedResponse(res, StatusCodes.CONFLICT, 'Container already register !!!');
        }
        
        const container = await containerModel.create({location, volume, location_link: url});

        if (!container) {
            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Unable to register container this time, please try again');
        }

        return Response.successResponse(res, StatusCodes.CREATED, 'Container registered', container);
        
       } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
       }
    }

    getAllContainer = async(req, res) => {
        try {
            
            const containers = await containerModel.find().sort({createdAt: 1}).populate('team_responsible');

            if (!containers) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'No container registered this time');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Containers found', containers);
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

                const updatedContainer = await containerModel.findByIdAndUpdate({_id: container_id}, {team_responsible: db_team._id,...req.body}, {new: true});


                if (!updatedContainer) {
                    return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Unable to update container record this time');
                }

                return Response.successResponse(res, StatusCodes.OK, 'Container record updated', updatedContainer);
            }

            const updatedContainer = await containerModel.findByIdAndUpdate({_id: container_id}, {...req.body}, {new: true});

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
            // const containerr = await containerModel.findById(container_id).populate('team_responsible');
            
            if (!container_id || !object_volume) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container ID and Object volume is required');
            }

            const container = await containerModel.findById(container_id);
            const team = await teamModel.findById(container.team_responsible[0]);
            if (!container) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container not found !!!')
            }

            const new_volume = container.volume_status + object_volume;
            const container_threshold1 = container.volume - (0.05 * container.volume);
            const container_threshold2 = container.volume - (0.03 * container.volume);
            if (new_volume > container_threshold2) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Container will be overfilled with this object');
            }

            else if (new_volume < container_threshold2) {
                container.volume_status = new_volume;
                container.percentage_level = (new_volume/container.volume) * 100
                await container.save();
                if (container.volume_status >= container_threshold1) {

                    const leaderName = team.leader1[0].first_name;
                    const link  = container.location_link;
                    const location = container.location;
                    const phone_number = team.leader1[0].phone;
                    const email_response = await sendFilledContainer(leaderName, location, link, team.leader1[0].email);
                    const sms_response =  await smsSender(location, link, phone_number);
                    console.log();
                    container.volume_status = 0;
                    container.percentage_level = 0;
                    container.week_filled_count += 1;
                    container.save();
                    if (email_response.accepted.length > 0 && sms_response.status === 'success') {
                        return Response.successResponse(res, StatusCodes.OK, `Container threshold reached. An SMS and Email has been sent to the ${team.name} team leader1`, container);
                    }

                    else if (email_response.accepted.length > 0 && sms_response.status !== 'success') {
                        return Response.successResponse(res, StatusCodes.OK, `Container threshold reached. An Email has been sent to the ${team.name} team leader1`, container);
                    }
                    
                    else if (email_response.accepted.length === 0 && sms_response.status === 'success') {
                        return Response.successResponse(res, StatusCodes.OK, `Container threshold reached. An SMS alert has been sent to the ${team.name} team leader1`, container);
                    }
                    else {
                        return Response.successResponse(res, StatusCodes.OK, `Container threshold reached. with no notification sent to ${team.name} team leader1`, container);
                    }
                }
                return Response.successResponse(res, StatusCodes.OK, 'Object added to container ...', container);
            }
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    assignToTeam= async(req, res) => {
        const {body: {container_id, team_name}} = req;

        if (!team_name) {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Team name must be provided');
        }
        const team = await teamModel.findOne({name: team_name});

        if (!team) {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Team no registered yet');
        }

        const db_container = await containerModel.findById(container_id);
        if (db_container.team) {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Container already assigned to team');
        }

        const test = await containerModel.findByIdAndUpdate({_id: container_id}, {team_responsible: [team._id]}, {new: true}).populate('team_responsible');
        return Response.successResponse(res, StatusCodes.OK, 'Container successfully assigned to team', test);
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

    weeklyDataCalculation = async() => {
       const containers = await containerModel.find();
       containers.forEach((container) => {
        if (container.week_filled_count !== 0) {
            let holder = {};
            const week_volume = container.week_filled_count * (0.95 * container.volume);
            const currentDate = new Date();
            const sevenDayAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
            
            holder.currentDate = currentDate;
            holder.sevenDayAgo = sevenDayAgo;
            holder.week_volume = week_volume;
    
            container.week_data_for_chart.push(holder);
            container.week_filled_count = 0;
            container.month_filled_count += 1;
            container.save();
    
            console.log(`Weekly cron job executed for non-empty container at location ${container.location}`);
        } else {
            console.log(`Weekly cron job executed for empty container at location ${container.location}`);
        }

       })
     }


     monthlyDataCalculation = async() => {
        const containers = await containerModel.find();
        containers.forEach((container) => {
        if (container.month_filled_count !== 0) {
            const holder = {};
            const week_volumes = [];
            container.week_data_for_chart.forEach((data) => {
                week_volumes.push(data.week_volume);
            })
            const currentDate = new Date();
            const month = currentDate.getMonth();
            let monthInYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const month_volume = week_volumes.reduce((accumulator, currentValue) =>
                accumulator + currentValue, 0);

            holder.month = monthInYear[month];
            holder.month_volume = month_volume;
    
            container.month_data_for_chart.push(holder);
            container.month_filled_count = 0;
            container.save();
    
            console.log(`Monthly cron job executed for non-empty container at location ${container.location}`);
        } else {
            console.log(`Monthly cron job executed for empty container at location ${container.location}`);
        }

       })
     }
    
}


export default new ContainerController();

