
import { StatusCodes } from "http-status-codes";
import { Response } from "../assessories/response.class.js";


const adminAuth = (req, res, next) => {
    
    try {
        const currentUser = req.user;
        if (!currentUser.role) {
            return Response.failedResponse(res, StatusCodes.FORBIDDEN, `Unauthorized access`)
        }
    
        if (currentUser.role !== 'admin') {
            return Response.failedResponse(res, StatusCodes.FORBIDDEN, `Unauthorized access`)
        }

        next();
    } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    } 
}


export default adminAuth;