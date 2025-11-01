// credentials: أي حاجة بتستخدمها علشان تثبت إنك الشخص المصرح له 
// transporter : carry your credentials
import nodemailer from "nodemailer";
export const sendMail = async ({to,subject,html}) => {
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });
    const info = await transporter.sendMail({
        from:`"Sara7a 👻" <${process.env.EMAIL_USER}> `,
        to,
        subject,
        html,
    });

    if(info.accepted.length)return true;
    return false;
}

