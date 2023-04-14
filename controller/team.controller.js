import teamModel from "../model/team.model.js";
import {Response} from '../assessories/response.class.js'
import { StatusCodes } from "http-status-codes";
import { restart } from "nodemon";



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

        const {body: {name, area}} = req;

        if (!name, area) {
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
    }

    addCollector = async(req, res) => {

        const {body: {id, team_name, leader, member}} = req;

        const team = await teamModel.findOne({name: team_name});

        if ((!team)) {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Team not registered');
        }

        const check_user = team.member.includes(id);

        if (check_user || team.leader.toString() === id) {
            return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'User already in the team')
        }

        else if (team.leader && team.member.length === 3) {
            return Response.failedResponse (res, StatusCodes.BAD_REQUEST, 'Team completed already');
        }

        else {
            if (member) {
                team.member.push(id);
                team.save();
                Response.successResponse(res, StatusCodes.OK, 'User added as team member', team);
            }
            else if(leader) {
                team.leader = id;
                team.save();
                Response.successResponse(res, StatusCodes.OK, 'User added as team leader', team);
            }
        }
    }
    

}