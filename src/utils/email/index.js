// credentials: أي حاجة بتستخدمها علشان تثبت إنك الشخص المصرح له 
// transporter : carry your credentials
import nodemailer from "nodemailer";
export async function sendMail ({to,subject,html}) {
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });
    await transporter.sendMail({
        from:" 'Sara7a app' <narimanahmed0987@gmail.com>",
        to,
        subject,
        html,
    })
}
