import teamModel from "../model/team.model.js";
import {Response} from '../assessories/response.class.js'
import { StatusCodes } from "http-status-codes";    
import pick from "lodash.pick";
import collectorModel from "../model/collector.model.js";



class TeamController {

    constructor () {

    }

    /**
     * Create Team Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and created team details
     */

    createTeam = async(req, res) => {

      try {
        
        const {body: {name, area}} = req;

        if (!name || !area) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'All field must be filed');
        }
        const existing_team = await teamModel.findOne({name});

        if (existing_team) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Team with this name already exist')
        }

        const created_team = await teamModel.create({name, area});

        if (!created_team) {
            return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Unable to create a team this time');
        }

        return Response.successResponse(res, StatusCodes.CREATED, 'Team successfully created', created_team);


      } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    }


       /**
     * Add Collector To Team Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property {Object} req.body - Collector properties to be updated
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and updated team details
     */


    addCollector = async(req, res) => {

       try {

        const {body: {collector_id, team_name, position}} = req;

        const collector = await collectorModel.findById(collector_id);

        const team = await teamModel.findOne({name: team_name});
        if ((!team)) {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Team not registered');
        }
        const member = [];
        team.member.forEach((membr) => {
            member.push(membr._id.toString());
        })


        if (team.leader1 !== "" && team.leader1._id == collector_id || team.leader2 !== "" && team.leader2._id == collector_id || member.includes(collector_id)){
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'User already in the team')
        }
        if (position === "member" ) {
            if (team.member.length === 2) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Ordinary team members cannot be more than two. Consider adding as a team lead or assitanct team lead instead')
            }
            else {

                team.member.push(collector);
                await team.save();

                await collectorModel.findByIdAndUpdate({_id: collector_id}, {team: team.id});

                return  Response.successResponse(res, StatusCodes.OK, 'User added as team member', team);
            }
        }

        if (position === "leader1" ) {
            if (team.leader1 !== "") {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Team alread has a lead')

            }
            const updated_team = await teamModel.findOneAndUpdate({name: team_name}, {$set: {leader1: collector}}, {new: true});

            await collectorModel.findByIdAndUpdate({_id: collector_id}, {team: team.id});

            return Response.successResponse(res, StatusCodes.OK, 'User added as team lead', updated_team);
        }

        else if (position === "leader2") {
            if (team.leader2 !== "") {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Team alread has an assistant team lead')
            }

            const updated_team = await teamModel.findOneAndUpdate({name: team_name}, {$set: {leader2: collector}}, {new: true});

            await collectorModel.findByIdAndUpdate({_id: collector_id}, {team: team.id});
            
            return Response.successResponse(res, StatusCodes.OK, 'User added as assistant team lead', updated_team);
        }

       } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
       }
    }



    /**
     * Remove Collector From Team Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property {Object} req.body - Collector properties to be updated
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and updated team details with the collector removed
     */

    removeCollector = async(req, res) => {
        try {
            const {body: {collector_id, team_id}} = req;
            const team = await teamModel.findById(team_id);
            
            if (!team) {
                return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error obtaining team details this');
            }

            if (team.leader1 !== "") {
                if (team.leader1._id.toString() === collector_id) {
                    const updated_team = await teamModel.findByIdAndUpdate({_id: team_id}, {$unset: {leader1: ""}}, {new: true});

                    await collectorModel.findByIdAndUpdate({_id: collector_id}, {$unset: {team: ""}});

                    return Response.successResponse(res, StatusCodes.OK, 'Collector successfully removed', updated_team);
                }
            }
           
           if (team.leader2 !== "") {

                if (team.leader2._id.toString() === collector_id) {
                    const updated_team = await teamModel.findByIdAndUpdate({_id: team_id}, {$unset: {leader2: ""}}, {new: true});

                    await collectorModel.findByIdAndUpdate({_id: collector_id}, {$unset: {team: ""}});

                    return Response.successResponse(res, StatusCodes.OK, 'Collector successfully removed', updated_team);
                }
           }
           const member = [];
           team.member.forEach((membr) => {
               member.push(membr._id.toString());
           })
           
            if (member.includes(collector_id)) {
                if (team.member.length === 1) {
                    const updated_team = await teamModel.findByIdAndUpdate({_id: team_id}, {$unset: {member: []}}, {new: true});

                    await collectorModel.findByIdAndUpdate({_id: collector_id}, {$unset: {team: ""}});

                    return Response.successResponse(res, StatusCodes.OK, 'Collector successfully removed', updated_team);
                }

                else if (team.member.length > 1) {
                    
                    team.member.forEach((member) => {
                        console.log(collector_id === member._id.toString());
                        if (collector_id === member._id.toString()) {
                            team.member.splice(team.member.indexOf(member), 1);
                            team.save();
                        }
                    })

                    await collectorModel.findByIdAndUpdate({_id: collector_id}, {$unset: {team: ""}});

                    return Response.successResponse(res, StatusCodes.OK, 'Collector successfully removed', team);
                }
                
          }

          else {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Collector not a member')
        }

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }

    }


    /**
     * Get Single Team Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property {Object} req.body - Collector properties to be updated
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and details of the single team requested.
     */

    getSingleTeam = async(req, res) => {
       try {
        const {body: {team_id}} = req;

        const team = await teamModel.findById(team_id);

        if (!team) {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Team not registered');
        }

        return Response.successResponse(res, StatusCodes.OK, 'Team found', team);


       } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
       }

    }



    /**
     * Get All Team Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property {Object} req.body - Collector properties to be updated
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and details of a registered teams.
     */

    getAllTeam = async(req, res) => {
        try {
            const teams = await teamModel.find().sort({createdAt: -1});

            if (!teams) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'No registered team at the moment');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Teams found', teams);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }

    }



    /**
     * Update Team Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property {Object} req.body - Collector properties to be updated
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and details of the updated team.
     */


    updatedTeam = async(req, res) => {
        try {

            const {body: {team_id, name, area}} = req;

            const updated_team = await teamModel.findByIdAndUpdate({_id: team_id}, {name, area}, {new: true});

            if (!updated_team) {
                return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error updating team record this time');
            }

            return Response.successResponse(res, StatusCodes.OK, 'Team record successfully updated', updated_team);

            } catch (error) {
                return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
            }

    }



    /**
     * Delete Team Controller
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @property {Object} req.body - Collector properties to be updated
     * @returns {JSON} - A JSON object representing the status, statusCode, message, and details of the deleted team.
     */


    deleteTeam = async(req, res) => {
        try {

            const {params: {team_id}} = req;

            const deleted_team = await teamModel.findOneAndDelete({_id: team_id});


            if (!deleted_team) {
                return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, 'Error deleting team record this time');
            }

            if (deleted_team.leader1 !== null) {
                await collectorModel.findByIdAndUpdate({_id: deleted_team.leader1}, {$unset: {team: ""}});
            }

            if (deleted_team.leader2 !== null) {
                await collectorModel.findByIdAndUpdate({_id: deleted_team.leader2}, {$unset: {team: ""}});
            }

            if (deleted_team.member.length !== 0) {
                deleted_team.member.forEach(async(collector_id) => {

                    await collectorModel.findByIdAndUpdate({_id: collector_id}, {$unset: {team: ""}})
                });
            }

            return Response.successResponse(res, StatusCodes.OK, 'Team record successfully deleted', deleted_team);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    

}

export default new TeamController();



