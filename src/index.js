import dotenv from "dotenv";
import express from "express";
import { bootstrap } from "./app.controller.js";


dotenv.config({path:"/config/local.env"});

// Permanently delete users who have been soft-deleted for more than 3 months                       
// schedule job to run at 3:02:01 AM every day of every month

const app = express();
const port = process.env.PORT;
bootstrap(app, express);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)