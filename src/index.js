import express from "express";
import { bootstrap } from "./app.controller.js";
import dotenv from "dotenv";
dotenv.config({path:"./"});
const app = express();
const port = process.env.PORT;
bootstrap(app, express);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})