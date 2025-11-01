import crypto from "crypto";

// export const encrypt = (data) => {
//     const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(process.env.ENCRYPTION_KEY), iv);
//     let encrypted = cipher.update(data);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return iv.toString("hex") + ":" + encrypted.toString("hex");
// };

// export const decrypt = (data) => {
//     const [iv, encrypted] = data.split(":");
//     const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(process.env.ENCRYPTION_KEY), Buffer.from(iv, "hex"));
//     let decrypted = decipher.update(encrypted, "hex", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
// };
