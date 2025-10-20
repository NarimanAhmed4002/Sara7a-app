import mongoose from "mongoose";
export function connectDB() {
    mongoose
    .connect(process.env.DB_URL , {serverSelectionTimeoutMS:5000})
    .then(()=>{
        console.log("DB connected successfully!");
    })
    .catch((err)=>{
        console.log("Fail to connect to DB!", err.message);
    })
}