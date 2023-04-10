import { Person } from "./person.class.js";
import userModel from "../model/user.model.js";



export class User extends Person {
    constructor (firstname, middlename = null, lastname, email, phone, address, username, password, confirm_password) {
        super(firstname, middlename, lastname, email, phone, address);
        this.username = username;
        this.password = password;
        this.confirm_password = confirm_password;
    }

    save = async( profile_image_url, profile_image_secure_url, image_public_id) => {
        return await userModel.create({first_name: this.firstname, middle_name: this.middlename, last_name: this.lastname, email: this.email, address: this.address, phone: this.phone, username: this.username, password: this.password, confirm_password: this.confirm_password, profile_image_url, profile_image_secure_url, image_public_id})
    }

    getWithId = async(user_id, email, username, phone) => {
        return await userModel.findOne({$or: [{_id: user_id, email, username, phone}]})
    }
    
    getWithoutId = async(email, username, phone) => {
        return await userModel.findOne({$or: [{email, username, phone}]})
    }
}