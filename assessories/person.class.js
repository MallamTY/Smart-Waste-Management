

export class Person{

    constructor (firstname, middlename, lastname, email, phone, address) {
        if (new.target === Person) {
            throw new TypeError('Cannot construct an abstract class directly');
        }
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.email = email;
        this.address = address;
        this.phone = phone;
    }

    save = async(profile_image_url, profile_image_secure_url, image_public_id) => {
        throw new TypeError('The save method is an abstract method that must be implemented')
    }

    getWithId = async() => {
        throw new TypeError('The get method is an abstract method that must be implemented')
    }

    getWithoutId = async() => {
        throw new TypeError('The get method is an abstract method that must be implemented')
    }
    
}