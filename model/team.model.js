const mongoose = require('mongoose');


const teamSchema = new mongoose.Schema({
    team_name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, `Team name can't be less than 3 characters !!!!!!!!`],
        maxlength: [20, `Team name can't be more than 50 characters !!!!!!!!`]
    },
    team_leader: {
        type: mongoose.Types.ObjectId(),
        ref: 'collector'
    },
    team_member: {
        type: [mongoose.Types.ObjectId],
        ref: 'collector'
    }
   
},
{timestamps: true});

const teamModel = mongoose.model('team', teamSchema);
export default teamModel;