import axios from "axios";
import { SMS_API_KEY } from "../configuration/configuration.js";

const url = 'https://www.bulksmsnigeria.com/api/v2/sms';


export const smsSender = (location, link, phone_number) => {

    const data = {
        
        body: `Container at ${location} is filled and needs to be evacuated. Please click on this link h${link} to get the location`,
        from: "Filled-Bin",
        to: phone_number,
        api_token: SMS_API_KEY,
        gateway: "direct-refund"
      };
      
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };

      return axios.post(url, data, {headers}).then(response => {
        return response.data.data;
      }).catch(error => { 
        return error;
      })
}
