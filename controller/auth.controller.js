import { StatusCodes } from "http-status-codes";
import { Response } from "../assessories/response.class.js";
import User from "../model/user.model.js";
import bcrypt from 'bcrypt';
import { generateOTP } from "../utility/otp.js";
import { emailTokenGenerator, verifyToken } from "../utility/token.js";
import Token from "../model/token.model.js";
import { sendOTP, sendResetPasswordLink, sendVerificationLink } from "../utility/emailSender.js";
import { response } from "express";



class AuthController {
    constructor () {

    }

    Login = async (req, res) => {
        try {
            
            const {body: {username, password, email}} = req;
        
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

    verifyEmail = async(req, res, next) => {
    
        try {
            const {params: {token}} = req;
            const payload = verifyToken(token);
            const db_token = await Token.findOne({user: payload.user_id, type: 'Verification Link'})
        
            if(!token) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid link !!!!!!!!!`)
            }
    
            if (!payload) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Error completing this operation !!!!!!!!!`)
            }
    
            if (!db_token) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Expired link !!!!!!!!!`)
                
            }
            
            const {user_id} = payload;
            const db_user = await User.findById(user_id);

            if (db_user.isEmailVerified === true) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Linked already used !!!!!!!!!`)
            }
            
            const user = await User.findByIdAndUpdate({_id: user_id}, {isEmailVerified: true}, {new: true});
    
            return Response.successResponse(res, StatusCodes.OK, `Account verified .......`, user);
    
    } catch (error) {
        return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
    };
    
    resendEmailVerificiationLink = async(req, res, next) => {
        try {
            const {params: {token}} = req;
            const payload = verifyToken(token);
    
            const newToken = emailTokenGenerator(payload.id, payload.email, payload.username);
            const expires =  Date.now() + 300000;
            await Token.create({token, user: payload.id, expires, type: 'Verification Link'});
            await sendVerificationLink(payload.email, payload.username, newToken);
    
            return Response.successResponse(res, StatusCodes.OK, `Verification link has been resent to ${payload.email}`, sent);
        
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    
    verifyOTP = async(req, res, next) => {
    
        try {
    
            const {params: {user_id},
                    body: {otp}
                                    } = req;
            if (!user_id) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid credentials !!!!!!!!!`)
            }
        
            const db_token = await Token.findOne({user: user_id, type: 'Login OTP'});
            
            if(db_token) {
                if (db_token.token === otp) {
                    if (db_token.valid) {
                        const login_user = await User.findById(user_id);
                        const token = tokenGenerator(user_id, login_user.role, login_user.email, login_user.username);
         
                        if (token) {
                            db_token.valid = false;
                            db_token.save();
                            return Response.failedResponse(res, StatusCodes.OK, `Login successful ..........`, token);
                    }
    
                    return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Unable to generate login token !!!`);
    
                }
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid one-time-password !!!`,);
                
            }
            return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Invalid one-time-password !!!`)
        }
        return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Your one-time-password has expired !!!`)
    
        } catch (error) {
            return Response.failedResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    
    }
    
    resendOTP = async(req, res, next) => {
        try {
            const {body: {user_id},
                            } = req;
            
            const user_db = await User.findById(user_id);
            const otp = generateOTP(6);
            
            const db_OTP = await Token.findOne({user: user_id, type: 'Login OTP'});
            
            
            if(db_OTP) {
                const expires = Date.now() + 300000;
                await sendOTP(user_db.email, user_db.username, otp);
                const updated_otp = await Token.findByIdAndUpdate(db_OTP.id, {token: otp, expires}); 
    
                return Response.successResponse(res, StatusCodes.OK, `A one-time-pssword has been resent to your registered email address ...`, updated_otp.token)
            }
    
            const expires = Date.now() + 300000;
            await sendOTP(user_db.email, user_db.username, otp);
            const token = await Token.create({token: otp, user: user_id, expires, type: 'Login OTP'});
            
            return Response.successResponse(res, StatusCodes.CREATED, `A one-time-pssword has been resent to your registered email address ...`, token);
    
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
    
            const db_user = await User.findOne({$or: [{email}, {username}]});
    
            if (!db_user) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `User not found !!!`)
            }
    
            const token = emailTokenGenerator(db_user.id, db_user.role, db_user.email);
    
            if (!token) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `Unable to generate token !!!`);
            }
    
            const db_token = await Token.findOne({user: db_user.id, type: 'Password Reset'});
            
            if (db_token) {
                const expires = Date.now() + 300000;
                sendResetPasswordLink(db_user.email, db_user.username, token);
                await Token.findByIdAndUpdate(db_token.id, {token, expires});
            
                return Response.successResponse(res, StatusCodes.OK, `A password reset link has been resent to ${db_user.email}`);
                 
            }
            const expires = Date.now() + 300000;
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
    
    
    updateUserProfile = async(req, res, next) => {
        try {
            const {user: {user_id}, body: {username, email}} = req;
            if (!username || !email) {
                return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `No field specified for update`);
            }
    
            if(username){
                const db_user = await User.findOne({username});
                if (db_user) {
                    return Response.failedResponse(StatusCodes.BAD_REQUEST, `Username already exist`);
                }
            }
            if (email) {
                const db_user = await User.findOne({email});
                if (db_user) {
                    return Response.failedResponse(res, StatusCodes.BAD_REQUEST, `email already exist`);
                }
            }
            const updated_user = await User.findByIdAndUpdate({_id: user_id}, {...req.body}, {new: true});
            if (!updated_user) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Error encountered while trying to update your record`);
            }
    
            return Response.successResponse(res, StatusCodes.OK, `Profile successfully updated`, updated_user);


        } catch (error) {
            return Response.failedResponse(Res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    
    }
    
    
    updateProfilePicture = async(req, res, next) => {
        try {
            const {user: {user_id}} = req;
    
            if (!req.file) {
                return Response.failedResponse(res, StatusCodes.EXPECTATION_FAILED, `Picture not selected`);
            }
            const db_user = await User.findById(user_id);
    
            deleteImage(db_user.profilepicture_public_url);
    
            const cloud_image = await uploads(req,'Users');
            
            const {public_id, url, secure_url} = cloud_image;
    
            db_user.profilepicture_public_url = public_id;
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
