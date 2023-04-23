import mongoose from "mongoose";



const containerSchema = new mongoose.Schema({
    location: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },

    volume: {
        type: Number,
        required: true,
        trim: true
    },

    team_responsible: {
        type: String,
        required: true,
        trim: true,
        ref: 'team'
    },

    volume_status: {
        type: Number
    },

    filled_count: {
        type: [Number],
    },

    filled_timestamp: {
        type: [Date],

    }
},
{timestamps: true}
);

const constainerModel = mongoose.model('container', containerSchema);
export default constainerModel;

