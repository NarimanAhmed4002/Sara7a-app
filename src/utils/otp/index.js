/**
 * 
 * @param {*} expireDate - in miliseconds 
 * @returns otp - otpExpireate
 */

export const generateOTP = (expireDate = 15 * 60 * 1000)=>{
    const otp = Math.floor(Math.random() * 90000 + 10000);
    const otpExpire = Date.now() + expireDate ;
    return {otp, otpExpire}
}