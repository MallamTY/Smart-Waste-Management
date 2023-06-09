import connectDB from "./dbConfiguration/db.config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { MONGO_URI, PORT } from "./configuration/configuration.js";
import Route from './routes/index.js'
import { StatusCodes } from "http-status-codes";
import { monthlyScheduler, weeklyScheduler } from "./cron.job.js";


const app = express();
app.use(morgan('common'));
app.use(cors());
app.use(express.json());
app.use('/api/v1/', Route)


app.get('*', (req, res) => {
    res.status(StatusCodes.OK).send(`Smart Waste Management System API`);
})




const startUp = async() => {
    const port  = PORT || 5000;
    await connectDB(MONGO_URI);
    app.listen(port, () => {
        console.log(`\n Smart Waste Management system listening on port ${port}....`);
    })
}


startUp();

