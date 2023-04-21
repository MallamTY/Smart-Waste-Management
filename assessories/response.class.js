class Respond {
    constructor () {
    }

    failedResponse = (res, StatusCodes, message) => {
        return res.status(StatusCodes).json({
            status: `failed`,
            message
            
        })
    }

    successResponse = (res, StatusCodes, message, result = '') => {
        return res.status(StatusCodes).json({
            status: `success`,
            message,
            result
            
        })
    }
}


export const Response = new Respond();


