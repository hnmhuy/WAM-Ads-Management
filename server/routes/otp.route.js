const express = require('express')
const router = express.Router()
const {sendOTP} = require("../controllers/otp.controller")

router.post("/", async(req, res)=>{
    try {
        const email = "kenshiro.pn@gmail.com"
        const duration = 1
        const createdOTP = await sendOTP({
            email,
            subject,
            duration
        });
        res.status(200).json(createdOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;