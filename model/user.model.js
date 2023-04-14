import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';



const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, `Firstname field can't be less than 3 characters !!!!!!!!`],
        maxlength: [50, `Firstname field can't be more than 50 characters !!!!!!!!`]
    },
    middle_name: {
        type: String,
        trim: true,
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
    username: {
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
    profile_image_url: {
        type: String
    },

    profile_image_secure_url: {
        type: String
    },
    image_public_id: {
        type: String
    },
    address: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        maxlength: 15
    }
    
    
},
{timestamps: true});

userSchema.pre("save", async function(next) {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirm_password = await bcrypt.hash(this.confirm_password, salt);
   
    return next();
})

const userModel = mongoose.model('user', userSchema);
export default userModel;

