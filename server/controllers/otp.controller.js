const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');
const controller = require('./auth.controller');
const OTPmodel = require('../models').otp;
const models = require('../models');

let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    auth:{
        user: "wamcustomerservice@hotmail.com",
        pass: "wamptudw21CLC9"
    }
})

transporter.verify((error, success)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Ready for messages");
        console.log(success);
    }
})

const sendEmail = async (mailOptions) =>{
    // try {
    //     await transporter.sendMail(mailOptions);
    //     return;
    // } catch (error) {
    //     throw error;
    // }
}

const sendOTP = async({email, subject, message, duration = 1}) => {
    // try {
    //     console.log(email);
    //     console.log(subject);
    //     console.log(message);
    //     console.log(models);
    //     if(!(email&& subject&& message)){
    //         console.log("Provide value for email, subject message")
    //     }
    //     try {
    //         await OTPmodel.destroy({
    //             where: {email: email}
    //         });
    //     } catch (error) {
    //         console.log(error.message)
    //     }

    //     const generatedOTP = Math.floor(1000 + Math.random() * 9000);
    //     const mailOptions = {
    //         from: "wamcustomerservice@hotmail.com",
    //         to: email,
    //         subject,
    //         html: `<p>${message}</p><p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${generatedOTP}</b></p><p>This code <b>expires in ${duration} hour</b>.</p>`
    //     }
    //     await sendEmail(mailOptions);
    //     const hashedData = await bcrypt.hash(generatedOTP.toString(), 10);
    //     await OTPmodel.create({email: email,otp: hashedData.toString(), createdAt: Date.now(), updatedAt: Date.now(), expireAt: Date.now() + 3600000 * +duration});
    // } catch (error) {
    //     throw error;
    // }
}

module.exports = {sendOTP};