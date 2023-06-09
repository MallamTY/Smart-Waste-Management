
import {Response} from '../assessories/response.class.js';
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utility/token.js";

const Authentication = (req, res, next) => {
    
    try {

        let {authorization} = req.headers
        if (!authorization) {
            return Response.failedResponse(res, StatusCodes.FORBIDDEN, `Authorization failed`)
        }

        const token = authorization.split(' ')[1];
        
        if (!token) {
            return Response.failedResponse(res, StatusCodes.FORBIDDEN, `Authorization failed`);
        }
     
        const payload = verifyToken(token);
        req.user = ({...payload})
        next();
        
    } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

export default Authentication;