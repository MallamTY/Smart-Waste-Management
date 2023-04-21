import mongoose from "mongoose";


const registeredEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
},
{timestamps: true});


const registeredEmailModel = mongoose.model('email', registeredEmailSchema);
export default registeredEmailModel;