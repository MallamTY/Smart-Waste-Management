import { Person } from "./person.class.js";
import userModel from "../model/user.model.js";



export class User extends Person {
    constructor (firstname, middlename, lastname, email, phone, address, username, password, confirm_password) {
        super(firstname, middlename, lastname, email, phone, address);
        this.username = username;
        this.password = password;
        this.confirm_password = confirm_password;
    }

      save = async() => {

        if (this.middlename === "" && this.email === "") {
            return await userModel.create({first_name: this.firstname, last_name: this.lastname, phone: this.phone, username: this.username, address: this.address, password: this.password, confirm_password: this.confirm_password})
        }
        
        else if (this.middlename === "" && this.email !== "") {
            return await userModel.create({first_name: this.firstname, last_name: this.lastname, email: this.email, phone: this.phone, username: this.username,address: this.address, password: this.password, confirm_password: this.confirm_password})
        }
           
        else if (this.middlename !== "" && this.email === "")
        {
            return await userModel.create({first_name: this.firstname, last_name: this.lastname, middle_name: this.middlename, phone: this.phone, username: this.username,address: this.address, password: this.password, confirm_password: this.confirm_password})
        }
        else {
            return await userModel.create({first_name: this.firstname, last_name: this.lastname, middle_name: this.middlename, email: this.email, phone: this.phone, username: this.username, password: this.password, confirm_password: this.confirm_password, address: this.address})
        }

     }

    getWithId = async(user_id, email, username, phone) => {
        return await userModel.findOne({$or: [{_id: user_id, email, username, phone}]})
    }
    
    getWithoutId = async(email, username, phone) => {
        return await userModel.findOne({$or: [{email, username, phone}]})
    }
}