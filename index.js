import connectDB from "./dbConfiguration/db.config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { MONGO_URI, PORT } from "./configuration/configuration.js";



const app = express();


app.use(morgan('common'));
app.use(cors());
app.use(express.json());






const startUp = async() => {
    const port  = PORT || 5000;
    await connectDB(MONGO_URI);
    app.listen(port, () => {
        console.log(`\n Smart Waste Management system listening on port ${port}....`);
    })
}


startUp();

