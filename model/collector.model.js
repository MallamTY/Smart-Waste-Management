import mongoose from "mongoose";


const collectorSchema = new mongoose.Schema({
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
        unique: true,
        sparse: true,
        trim: true
    },

    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team' 
    },

    image_url: {
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

const collectorModel = mongoose.model('collectors', collectorSchema);



export default collectorModel;