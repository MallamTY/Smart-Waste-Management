import { Person } from "./person.class.js";
import collectorModel from "../model/collector.model.js";



export class Collector extends Person {
  constructor (firstname, middlename, lastname, email, phone, address) {
        super(firstname, middlename, lastname, email, phone, address)
     }
     
     save = async( profile_image_url, profile_image_secure_url, image_public_id) => {
        
        if (this.middlename === "" && this.email === "") {
            return await collectorModel.create({first_name: this.firstname, last_name: this.lastname, phone: this.phone, address: this.address, profile_image_url,profile_image_secure_url, image_public_id})
        }

        else if (this.middlename === "" && this.email !== "") {

            return await collectorModel.create({first_name: this.firstname, last_name: this.lastname, email: this.email, phone: this.phone, address: this.address, profile_image_url,profile_image_secure_url, image_public_id})
        }
           
        else if (this.middlename !== "" && this.email === "")
        {
            return await collectorModel.create({first_name: this.firstname, last_name: this.lastname, middle_name: this.middlename, phone: this.phone, address: this.address, profile_image_url,profile_image_secure_url, image_public_id})
        }
        else {

            return await collectorModel.create({first_name: this.firstname, last_name: this.lastname, middle_name: this.middlename, email: this.email, phone: this.phone, address: this.address, profile_image_url,profile_image_secure_url, image_public_id})
        }

     }
     
     getWithId = async(user_id) => {
        return await collectorModel.findById({_id: user_id})
    }
    
    getWithoutId = async(phone) => {
        return await collectorModel.findOne({phone})
    }
    
}

