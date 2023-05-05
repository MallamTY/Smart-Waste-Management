
import {StatusCodes} from 'http-status-codes';
import { User } from '../assessories/user.class.js';
import pick from 'lodash.pick';
import UserModel from '../model/user.model.js';
import validator from 'validator';
import { Response } from '../assessories/response.class.js';
import Token from '../model/token.model.js';
import { sendOTP} from '../utility/emailSender.js';
import registeredEmailModel from '../model/users.email.model.js';
import { generateOTP } from '../utility/otp.js';
import { response } from 'express';
import userModel from '../model/user.model.js';



class UserController {
    constructor() {

    }
        /**
         * Signup
         */
        SignUp = async(req, res, next) => {
           try {

            const {body: {first_name, last_name, middle_name, email, username, password, confirm_password, address, phone}} = req;

            if (!first_name || !last_name || !email || !password || !username || !confirm_password || !address || !phone) {
               return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `All required fields must be filled`)
            }
            if (!validator.isStrongPassword(password) && !validator.isStrongPassword(confirm_password)){

                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Password must contain at least, an Uppercase letter, a number and a special character`);
            }


            if ( password !== confirm_password ) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Password not match !!!`)
            }

            if (!validator.isEmail(email.toLowerCase())) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid email format supplied`)
            }

            const emailDB = await registeredEmailModel.findOne({email: email.toLowerCase()});

            if (!emailDB) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `You can't singup this time, please contact the administrator.`);
            }

            const user = new User(first_name, middle_name, last_name, email.toLowerCase(), phone, address, username, password, confirm_password)
            
            const existingUser = await user.getWithoutId(email.toLowerCase(), username, phone);
            
            if (existingUser) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `User already registered`)
            }

            else{
                
                
                let created_user = await user.save();

                if (created_user) {
                
                    const otp = generateOTP(6);
                    const expires =  Date.now() + 300000;
                    await Token.create({token: otp, user: created_user.id, expires, type: 'Verification OTP'});

                    await sendOTP(user.email, user.username, otp);

                    let user = [];

                    user = ['_id', 'first_name', 'last_name', 'middle_name', 'profile_image_secure_url', 'profile_image_url', 'image_public_id', 'role', 'address', 'phone'];
                    created_user = pick(created_user, user);

                    return Response.successResponse(res, StatusCodes.CREATED, `An OTP has been sent to your email address !!!!`, created_user);
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

    getUser = async (req, res, next) => {
        try {
            const {user: {user_id}} = req;

        if (!user_id) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'User_id must be specified');
        }

        let db_user = await UserModel.findById(user_id);

        if (!db_user) {
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'User not found');
        }

        let user = [];

        user = ['_id', 'first_name', 'last_name', 'middle_name', 'profile_image_secure_url', 'profile_image_url', 'image_public_id', 'role', 'address', 'phone'];
        db_user = pick(db_user, user);



        return Response.successResponse(res, StatusCodes.OK, 'User found ...', db_user);
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    getAllUser = async(req, res, next) => {
        try {
            
            let db_users = await UserModel.find();

            if(!db_users) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'No user found in the database');
            }
        
            let db_users_holder = [];
            let user = [];
            db_users.forEach(db_user => {
                user = ['_id', 'first_name', 'last_name', 'middle_name', 'profile_image_secure_url', 'profile_image_url', 'image_public_id', 'role', 'address', 'phone'];
                const db_useri = pick(db_user, user);
                db_users_holder.push(db_useri);
        
            })
            
            return Response.successResponse(res, StatusCodes.OK, 'User found', db_users_holder);

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}



export default new UserController();
