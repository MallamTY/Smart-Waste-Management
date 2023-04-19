class Respond {
    constructor () {
    }

    failedResponse = (res, StatusCodes, message) => {
        return res.status(StatusCodes).json({
            status: `failed`,
            message
            
        })
    }

    successResponse = (res, StatusCodes, message, value = '') => {
        return res.status(StatusCodes).json({
            status: `success`,
            message,
            value
            
        })
    }
}


export const Response = new Respond();


