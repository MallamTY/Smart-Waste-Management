import { StatusCodes } from "http-status-codes";
import { Response } from "../assessories/response.class";



class Authenticator {
    constructor () {

    }

    Login = async (req, res) => {
        try {
            
            const reqbody = req.body
            username = reqbody.username;
            email = reqbody.email;
            password = reqbody.password;
        
            if(!(username || email) && !password) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `All fields must be filled`)
            }
        
            let userDB = await User.findOne({$or: [{username}, {email}]})
            if (!userDB) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Invalid credentials !!!!!')
            }
            const match = await bcrypt.compare(password, userDB.password);
            
            if (!match) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `Invalid email or password !!!!!!!!!`)
            }
        
            if (userDB.isEmailVerified === false) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Account not verified yet, click on the verification link sent to your email !!!!!!!!!`)
            }
            
            const otp = generateOTP(6);
            const expires = Date.now() + 300000;
        
            await sendOTP(userDB.email, userDB.username, otp);
            await Token.create({token: otp, user: userDB.id, expires, type: 'Login OTP'});
        
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `A one-time-password has been sent to your registered email address ... ${otp}`,
                user: userDB
            })
            
        
        } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: `failed`,
            message: error.message
        })
        }
        
    }
}