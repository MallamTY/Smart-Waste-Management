import mongoose from "mongoose";



const connectDB = (URI) => {
    mongoose.connect(URI)
    .then(() => {
        console.log(`\n Connection to database established ... \n`);
    })
    .catch((error) => {
        throw(error)
    })
}


export default connectDB;
