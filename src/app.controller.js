import {connectDB} from "./DB/connection.js";
import {authRouter, userRouter, messageRouter} from "./modules/index.js"
import cors from "cors";
import { globalErrorHandler } from "./utils/error/index.js";
import rateLimit from "express-rate-limit";
export function bootstrap (app, express) {
    // handle rate limiter >> used to handle time between [limit >> number]requests
    const limter = rateLimit({
        windowMs: 60 *1000, // 1 min
        limit:3,
        // legacyHeaders:true // hide no of limited times from headers
        handler:(req,res,next, options)=>{
        // throw new Error("ay haga", {cause:400}) // option >> btdeny kol elly ratelimit 3ndha by default
        throw new Error(options.message,{cause:options.statusCode});
        },
        identifier:req.ip // req.token // each user has its own limit
    })
    // const limter2 = rateLimit({
    //     windowMs: 60 *1000, // 1 min
    //     limit:3,
    //     // legacyHeaders:true // hide no of limited times from headers
    //     handler:(req,res,next, options)=>{
    //     // throw new Error("ay haga", {cause:400}) // option >> btdeny kol elly ratelimit 3ndha by default
    //     throw new Error(options.message,{cause:options.statusCode});
    //     },
    //      skipSuccessfulRequests:true, // don't count successful requests
    //     identifier:req.ip // req.token
    // }) 
    app.use("/auth", limter)
    // app.use("/user", limter2) // momken a3ml configrations lkol module
    // parse raw json
    app.use(express.json());
    app.use(express.static("uploads"));// serve static files from uploads folder

    // allow FE to access BE
    app.use(cors({
        origin:"http://localhost:3001"
    }));

    
    // routers
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/message", messageRouter)

    // globalErrorHandler
    // must be after routers
    app.use(globalErrorHandler)

    // Database connection >> operation buffering
    connectDB()
}