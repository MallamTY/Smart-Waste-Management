import dotenv from "dotenv";
dotenv.config();



export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;



//Cloudinary Auth Details

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY
export const API_SECRET= process.env.API_SECRET 
export const SECURE = process.env.SECURE;


// Jsonwebtoken secret

export const JWT_SECRET = process.env.JWT_SECRET;

// Google Email Credentials

export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const OAUTH_CLIENTID = process.env.OAUTH_CLIENTID;
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

