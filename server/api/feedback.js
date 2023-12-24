const controller = {};
const models = require("../models");

controller.reCaptcha = (req, res) => {
    const params = new URLSearchParams({
        secret: "6Lf3MDopAAAAAE617VRXJ87gQ_4fdmksat-yKfB6",
        response: req.body["g-recaptcha-response"],
        remoteip: req.ip,
    });

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params,
    })
        .then((res) => res.json())
        .then((data) => {
        if (data.success) {
            res.json({ captchaSuccess: true });
        } else {
            res.json({ captchaSuccess: false });
        }
        });

}

controller.sendFeedback = async (req, res) =>
{
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let {email, name, phone, mytextarea, type} = req.body;
    let data = await models.feedback.create({
        name: name,
        email: email,
        phone: phone,
        content: mytextarea,
        type: type,
    })
    res.json({ message: 'Received feedback successfully!', data:data });

}

module.exports = controller;