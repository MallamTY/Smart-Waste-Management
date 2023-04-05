const mongoose = require('mongoose');


const binSchema = new mongoose.Schema({
    bin_location: {
        type: String,
        required: true,
        trim: true,
    },
    bin_size : {
        type: Number,
        required: true,
        trim: true
    },
    bin_status: {
        type: String,
        required: true,
        trim: true,
        default: 'Empty'
    },
    last_filled: {
        type: Date,
    },
    last_evacuated: {
        type: Date
    },
    collection_team : {
        type: mongoose.Types.ObjectId(),
        ref: 'team'
    }
   
},
{timestamps: true});

const binModel = mongoose.model('bin', binSchema);
export default binModel;