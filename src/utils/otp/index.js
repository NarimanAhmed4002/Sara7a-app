/**
 * 
 * @param {*} expireDate - in miliseconds 
 * @returns otp - otpExpireate
 */

import { generateHash } from "./otpHash.js";

export const generateOTP = (expireDate = 15 * 60 * 1000)=>{
    const otp = Math.floor(Math.random() * 90000 + 10000);
    const otpExpire = Date.now() + expireDate ;
    const hashOTP = generateHash(otp);
    return {otp, otpExpire, hashOTP}
}