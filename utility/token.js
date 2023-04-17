import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../accessories/configuration.js";


export const tokenGenerator = (user_id = '', role = '', email = '', username = '') => {
    let token = '';
    if (email === '') {
        return token = jwt.sign({user_id, username, role}, JWT_SECRET, {expiresIn: '2d'})
    }
    else if(username === '') {
        return token = jwt.sign({user_id, email, role}, JWT_SECRET, {expiresIn: '2d'})
    }
    else if (email === '' && username === '') {
        return token = jwt.sign({user_id, role}, JWT_SECRET, {expiresIn: '2d'})
    }
    return token = jwt.sign({user_id, role, email, username}, JWT_SECRET, {expiresIn: '2d'})
}


export const emailTokenGenerator = (user_id = '', role = '', email = '', username = '') => {
    let token = '';
    if (email === '') {
        return token = jwt.sign({user_id, username, role}, JWT_SECRET)
    }
    else if(username === '') { 
        return token = jwt.sign({user_id, email, role}, JWT_SECRET)
    }
    else if (email === '' && username === '') {
        return token = jwt.sign({user_id, role}, JWT_SECRET)
    }
}


export const verifyToken = (token) => {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return decodedToken;
}

