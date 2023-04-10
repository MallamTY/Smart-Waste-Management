class Respond {
    constructor () {
    }

    failedResponse = (res, StatusCodes, message) => {
        return res.status(StatusCodes).json({
            status: `failed`,
            message
            
        })
    }

    successResponse = (res, StatusCodes, message) => {
        return res.status(StatusCodes).json({
            status: `success`,
            message
            
        })
    }
}


export const Response = new Respond();


