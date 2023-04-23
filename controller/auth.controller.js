import { StatusCodes } from "http-status-codes";
import validator from "validator";
import { Response } from "../assessories/response.class.js";
import User from "../model/user.model.js";
import bcrypt from 'bcrypt';
import { generateOTP } from "../utility/otp.js";
import { emailTokenGenerator, tokenGenerator, verifyToken } from "../utility/token.js";
import Token from "../model/token.model.js";
import { sendOTP, sendResetPasswordLink } from "../utility/emailSender.js";
import { deleteImage, uploads } from "../utility/cloudinary.js";



class AuthController {
    constructor () {

    }

    Login = async (req, res) => {
        try {
            
            const {body: {username, password, email}} = req;
        
            if(!(username || email) && !password) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `All fields must be filled`)
            }
        
            let user = await User.findOne({$or: [{username}, {email:email.toLowerCase()}]})
            if (!user) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, 'Invalid credentials !!!!!')
            }
            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `Invalid email or password !!!!!!!!!`)
            }
        
            if (user.isEmailVerified === false) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Account not verified yet, check your registered email for otp to verify your email !!!`);
            }
            
            const token = tokenGenerator(user.id, user.role, user.email, user.username);
        
            return res.status(StatusCodes.OK).json({
                status: `success`,
                message: `Login successful ...`,
                token
            })
            
        
        } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: `failed`,
            message: error.message
        })
        }
        
    }

    verifyAccount = async(req, res, next) => {
    
        try {
            const {body: {otp}, params: {user_id}} = req;

            if (!otp) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'one-time-password must be supplied');
            }
            
            const db_otp = await Token.findOne({user: user_id, type: 'Verification OTP'});

            if(!db_otp) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid one-time-password, please resend OTP`);
            };

            if (otp !== db_otp.token) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'Incorrect one-time-password');
            }

            if (Date.now() > db_otp.expires) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, 'one-time-password');
            }
            const db_user = await User.findById(user_id);

            if (db_user.isEmailVerified === true) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Account already verified`)
            }
            
            const user = await User.findByIdAndUpdate({_id: user_id}, {isEmailVerified: true}, {new: true});
    
            return Response.successResponse(res, StatusCodes.OK, `Account verified .......`, user);
    
    } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
    };
    
    resendOTP = async(req, res, next) => {
        try {
            const {body: {user_id},
                            } = req;
            
            const user_db = await User.findById(user_id);
            const otp = generateOTP(6);
            
            const db_otp = await Token.findOne({user: user_id, type: 'Verification OTP'});
            
            
            if(db_otp) {
                const expires = Date.now() + 300000;
                await sendOTP(user_db.email, user_db.username, otp);
                const updated_otp = await Token.findByIdAndUpdate(db_otp.id, {token: otp, expires}); 
    
                return Response.successResponse(res, StatusCodes.OK, `A one-time-pssword has been resent to your registered email address ...`)
            }
    
            const expires = Date.now() + 300000;
            await sendOTP(user_db.email, user_db.username, otp);
            await Token.create({token: otp, user: user_id, expires, type: 'Verification OTP'});
            
            return Response.successResponse(res, StatusCodes.CREATED, `A one-time-pssword has been resent to your registered email address ...`);
    
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.messgae);
        }
    }
    
    forgetPassword = async(req, res, next) => {
    
        try {
            const {body: {email, username}} = req;
            if(!validator.isEmail(email)) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid email address !!!`);
            }
    
            const db_user = await User.findOne({$or: [{email: email.toLowerCase()}, {username}]});
    
            if (!db_user) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `User not found !!!`)
            }
    
            const token = emailTokenGenerator(db_user.id, db_user.role, db_user.email);
    
            if (!token) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `Unable to generate token !!!`);
            }
    
            const db_token = await Token.findOne({user: db_user.id, type: 'Password Reset'});
            
            if (db_token) {
                const expires = Date.now() + 600000;
                sendResetPasswordLink(db_user.email, db_user.username, token);
                await Token.findByIdAndUpdate(db_token.id, {token, expires});
            
                return Response.successResponse(res, StatusCodes.OK, `A password reset link has been resent to ${db_user.email}`);
                 
            }
            const expires = Date.now() + 600000;
            sendResetPasswordLink(db_user.email, db_user.username, token);
            await Token.create({token, user: db_user.id, expires, type: 'Password Reset'});
    
            return Response.successResponse(res, StatusCodes.OK, `A password reset link has been sent to ${db_user.email}`)
    
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    
    resetPassword = async(req, res, next) => {
    
        try {
    
                const {body: {new_password, confirm_new_password},
                params: {token}
                                    } = req;
                const payload = verifyToken(token)
                const user_id = payload.user_id;
                                    
                const validity_check = await Token.findOne({user: user_id, type: 'Password Reset'});
            
                if (!validity_check) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid link !!!`)
                }
    
                if (validity_check.valid === false) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid link !!!`);
                }
    
                if (!validator.isStrongPassword(new_password || !validator.isStrongPassword(confirm_new_password))) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Password not strong enough !!!`);
                }
    
                if (new_password !== confirm_new_password) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Password not match`);
                }
                
                if (validity_check.token !== token) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid link !!!`);
                }
                
                
                const update_user = await User.findById(user_id);
            
                if (!update_user) {
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Unabale to change your password this time !!!`);
                }
    
                update_user.password = new_password;
                update_user.confirm_password = confirm_new_password;
                update_user.save();
    
                const updated_token = await Token.findOneAndUpdate({id: user_id, type: 'Password Reset'}, {valid: false});
    
                return Response.successResponse(res, StatusCodes.OK, `Password reset successful ...`)
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    

    uploadProfilePicture = async(req, res, next) => {
        try {
            
            const {user: {user_id}} = req;

            if (!user_id) {
                return Response(res, StatusCodes.FORBIDDEN, 'You must login to perform this operation');
            }

            const user = await User.findById(user_id);

            const cloud_user_details = await uploads(req, 'Smart-Waste-System-User');

            const {public_id, url, secure_url} = cloud_user_details;
    
            user.image_public_id = public_id;
            user.profile_image_secure_url = secure_url;
            user.profile_image_url = url;

            const updated_user = await user.save();
    
            if (!updated_user) {
                return Response.failedResponse(res, StatusCodes, `Error encountered while trying to update your profile picture`);
            }
    
            return Response.successResponse(res, StatusCodes.OK, 'Profile picture successfully uploaded', updated_user);

        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    
    updateUserProfile = async(req, res, next) => {
        try {
            const {user: {user_id}, body: {username, email}} = req;

            if(username){
                const db_user = await User.findOne({username});
                if (db_user) {
                    return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `Username already exist`);
                }
            }
            if (email) {
                const db_user = await User.findOne({email: email.toLowerCase()});
                if (db_user) {
                    return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `Email already exist`);
                }
            }
            const updated_user = await User.findByIdAndUpdate({_id: user_id}, {...req.body}, {new: true});

            if (!updated_user) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Error encountered while trying to update your record`);
            }
    
            return Response.successResponse(res, StatusCodes.OK, `Profile successfully updated`, updated_user);


        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    
    }
    
    
    updateProfilePicture = async(req, res, next) => {
        try {
            const {user: {user_id}} = req;

            if (!req.file) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Picture not selected`);
            }
            const db_user = await User.findById(user_id);

            await deleteImage(db_user.image_public_id);
    
            const cloud_image = await uploads(req, 'Smart-Waste-System-User');
            const {public_id, url, secure_url} = cloud_image;

            db_user.image_public_id = public_id;
            db_user.profile_image_secure_url = secure_url;
            db_user.profile_image_url = url;

            const updated_user = await db_user.save();
    
            if (!updated_user) {
                return Response.failedResponse(res, StatusCodes, `Error encountered while trying to update your profile picture`);
            }
    
            return Response.successResponse(res, StatusCodes.OK, updated_user);
            
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}

export default new AuthController();
