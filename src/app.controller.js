import {connectDB} from "./DB/connection.js";
import {authRouter, userRouter, messageRouter} from "./modules/index.js"
import cors from "cors";
import { globalErrorHandler } from "./utils/error/index.js";
import rateLimit from "express-rate-limit";

export function bootstrap (app, express) {
    const limiter = rateLimit({
        windowMs: 1 * 60 * 1000, 
        limit: 3,
        handler: (req, res, next, options) => {
            throw new Error(options.message, { cause: options.statusCode });
        },
        standardHeaders: true,
        legacyHeaders: false
    });
    app.use("/auth", limiter)
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