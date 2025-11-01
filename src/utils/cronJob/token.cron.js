import cron from "node-cron";
import { User } from "../../DB/models/user.model.js";
import { Message } from "../../DB/models/message.model.js";
import { deleteFolder } from "../cloud/cloudinary.config.js";

export const cronJobForDeleteTokens = () => {
    cron.schedule("1 2 3 * * *", async () => {
    const users = User.find({
        deletedAt:{$lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000}
    })
    for (const user of users) {
        if(user.profilePictureCloud.public_id)
        await deleteFolder(`saraha-app/users/${user._id}`);
    };

    const result = await User.deleteMany({ 
        deletedAt: 
        {$lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 } 
    });

    console.log(`${result.deletedCount} users permanently deleted.`);
    

    await Message.deleteMany({
        receiver: { $in: users.map(user => user._id) }
    });

});
}