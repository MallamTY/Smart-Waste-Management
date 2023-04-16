import mongoose from "mongoose";


const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, `Team name can't be less than 3 characters !!!!!!!!`],
        maxlength: [20, `Team name can't be more than 50 characters !!!!!!!!`]
    },
    area: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, `Team name can't be less than 3 characters !!!!!!!!`],
        maxlength: [100, `Team area can't be more than 50 characters !!!!!!!!`]
    },
    
    leader1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collector',
        default: null
    },

    leader2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collector',
        default: null
    },

    member: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'collector',
        default: []
    }
   
},
{timestamps: true});

const teamModel = mongoose.model('team', teamSchema);

export default teamModel;