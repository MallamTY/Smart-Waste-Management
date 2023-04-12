
import {StatusCodes} from 'http-status-codes';
import { User } from '../assessories/user.class.js';
import { uploads } from '../utility/cloudinary.js';
import validator from 'validator';
import { Response } from '../assessories/error.class.js';



class UserController {
    constructor() {

    }
        /**
         * Signup
         */
        SignUp = async(req, res, next) => {
           try {

            const {body: {first_name, last_name, middle_name = null, email, username, password, confirm_password, address, phone}} = req;
        
            if (!first_name || !last_name || !email || !password || !username || !confirm_password || !address || !phone) {
               return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `All required fields must be filled`)
            }
            if (!validator.isStrongPassword(password) && !validator.isStrongPassword(confirm_password)){

                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Password must contain at least, an Uppercase letter, a number and a special character`);
            }


            if ( password !== confirm_password ) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Password not match !!!`)
            }

            if (!validator.isEmail(email)) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid email format supplied`)
            }

            const user = new User(first_name, middle_name, last_name, email, phone, address, username, password, confirm_password)
            
            const existingUser = await user.getWithoutId(email, username, phone);
            
            if (existingUser) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `User already registered`)
            }

            else{
                
                // Upload user uploaded image to cloudinary

                const cloud_user_details = await uploads(req, 'Smart-Waste-User');

                const created_user = await user.save(cloud_user_details.url, cloud_user_details.secure_url, cloud_user_details.public_id);
                if (created_user) {
                    return Response.successResponse(res, StatusCodes.CREATED, `User successfully created ..`, created_user)
                }
                else {
                    return Response.failedResponse(res, StatusCodes.FAILED_DEPENDENCY, `An error was encountered while trying to save your data this time, try again later ...`)
                }
           
        }
    }
    
    catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }

    }
}



export default new UserController();
