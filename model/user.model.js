const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, `Firstname field can't be less than 3 characters !!!!!!!!`],
        maxlength: [50, `Firstname field can't be more than 50 characters !!!!!!!!`]
    },
    middlename_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, `Firstname field can't be less than 3 characters !!!!!!!!`],
        maxlength: [50, `Firstname field can't be more than 50 characters !!!!!!!!`]
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, `Firstname field can't be less than 3 characters !!!!!!!!`],
        maxlength: [50, `Firstname field can't be more than 50 characters !!!!!!!!`]
    },
    email: {
        type: String,
        required: true,
        unique: true,

        trim: true

    },
    password: {
        type: String,
        required: true,
        maaxlength: 200
    },
    confirm_password: {
        type: String,
        required: true,
        maxlength: 200
    },
    profile_picture_url: {
        type: String
    },

     profile_picture_secure_url: {
        type: String
    },
    address: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    phone: {
        type: Number,
        trim: true,
        unique: true,
        maxlength: 15
    }
    
    
},
{timestamps: true});

userSchema.pre("save", async function (next) {
    if (this.password !== this.confirmpassword) {
        throw Error('Password mismatch !!!!!')
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, salt);

    return next();
})

const userModel = mongoose.model('user', userSchema);
export default userModel;

