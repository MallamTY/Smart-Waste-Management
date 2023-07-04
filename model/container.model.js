import mongoose from "mongoose";



const containerSchema = new mongoose.Schema({
    location: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    location_link: {
        type: String,
        required: true
    },

    volume: {
        type: Number,
        required: true,
        trim: true
    },

    team_responsible: {
        type: mongoose.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'team'
    },

    volume_status: {
        type: Number
    },

    filled_count: {
        type: Number,
        default: 0
    },

    volume_status: {
        type: Number
    },

    percentage_level: {
        type: Number
    },

    last_evacuation: {
        type: Date,
    },

    week_volume: {
        type: Number
    },
    monthly_volume: {
        type: Number
    },

    week_data_for_chart: {
        type: Array
    },

    month_data_for_chart: {
        type: Array
    }

},
{timestamps: true}
);

const constainerModel = mongoose.model('container', containerSchema);
export default constainerModel;

