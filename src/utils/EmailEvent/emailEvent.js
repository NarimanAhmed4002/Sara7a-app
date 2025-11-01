import { emailTemplate } from "../email/emailTemplate.js";
import {sendMail} from "../email/index.js";
import { EventEmitter } from "events";

export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async (data) => {
    let {name, email, otp} = data;

    const success = await sendMail({
        subject:"Confirm Email",
        html: emailTemplate({
            emailSubject:"Confirm Email",
            body:`
            <p>Thank you for using our platform. Below is your verification code:</p>
            <p>Please enter this code in the app to complete your verification. The code is valid for 3 minutes.</p>
            <p>If you did not request this code, please ignore this email or contact our support team.</p>
            `,
            otp
        }),
        to:email,
    });
    success ? console.log("Email sent successfully") : console.log("Email failed to send");
})