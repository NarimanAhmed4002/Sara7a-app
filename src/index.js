import express from "express";
import { bootstrap } from "./app.controller.js";
import dotenv from "dotenv";
import schedule from "node-schedule";
import { User } from "./DB/models/user.model.js";
import { deleteFolder } from "./utils/cloud/cloudinary.config.js";
import { Message } from "./DB/models/message.model.js";
dotenv.config({path:"/config/local.env"});
// Permanently delete users who have been soft-deleted for more than 3 months                       
// schedule job to run at 3:02:01 AM every day of every month
schedule.scheduleJob("1 2 3 * * *", async () => {
    const users = User.find({
        deletedAt:{$lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000}
    })
    for (const user of users) {
        if(user.profilePictureCloud.public_id)
        await deleteFolder(`saraha-app/users/${user._id}`);
    };

    await User.deleteMany({ 
        deletedAt: 
        {$lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 } 
    });

    await Message.deleteMany({
        receiver: { $in: users.map(user => user._id) }
    });

});
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