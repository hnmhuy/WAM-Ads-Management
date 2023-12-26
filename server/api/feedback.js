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
    let fileList = req.files;
    let img1, img2;
    if (fileList.length === 2)
    {
        img1 = fileList[0].path;
        img2 = fileList[1].path;
    }
    else if (fileList.length === 1)
    {
        img1 = fileList[0].path;
        img2 = null;
    }
    else
    {
        img1 = img2 = null
    }

    let {email, name, phone, mytextarea, type} = req.body;
    let data = await models.feedback.create({
        name: name,
        email: email,
        phone: phone,
        content: mytextarea,
        type: type,
        image1: img1,
        image2: img2
    })

    feedbackId = data.id;

    console.log("This is req", req.files);
    console.log("this is feedbackID: ", data);

    
    res.json({ message: 'Received feedback successfully!', data:data });
    
}


controller.getFeedback = async (req, res) => {
    let id = req.query.id;
    console.log("Thiss is id: ", id);
    await models.feedback.findAll({
        where: {id: id},
    }).then((data) => res.json(data)).catch((err) => res.json(err));

}




module.exports = controller;