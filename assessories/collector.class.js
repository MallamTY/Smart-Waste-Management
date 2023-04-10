import { Person } from "./person.class.js";
import collectorModel from "../model/collector.model.js";



export class Collector extends Person {
  constructor (firstname, middlename = null, lastname, email = '', phone, address) {
        super(firstname, middlename, lastname, email, phone, address)
     }
     
     save = async( profile_image_url, profile_image_secure_url, image_public_id) => {
      return await collectorModel.create({first_name: this,firstname, middle_name: this.middlename, last_name: this.lastname, email: this.email, phone: this.phone, address: this.address, profile_image_url,profile_image_secure_url, image_public_id})

     }
     
     getWithId = async(user_id, email, username, phone) => {
        return await userModel.findOne({$or: [{_id: user_id, email, username, phone}]})
    }
    
    getWithoutId = async(email, username, phone) => {
        return await userModel.findOne({$or: [{email, username, phone}]})
    }
    
}