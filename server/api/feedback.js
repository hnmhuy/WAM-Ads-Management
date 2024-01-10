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


async function getFeedbackByArea(areaId)
{
    return await models.feedback.findAll({
        // attribute:['name', 'email', 'phone','content', 'type', 'image1', 'image2'],
        attributes: ['id','createdAt', 'type', 'status'],
        include: [
            {model: models.place, where: {area_id: areaId}},
            {model: models.category, attributes: ['name']},
        ]          
    })
}

async function getResponse(response_id) {
    try {
        let data = await models.feedback_response.findOne({
            attributes: ['officer', 'createdAt', 'content'],
            where: {id: response_id},
            include: [
                {model: models.account, attributes:['first_name', 'last_name']},
            ]
        })
        return {
            isSuccess: true,
            data: data
        }
    }
    catch {(err) => {
        console.log(err);
        return {
            isSuccess: false,
            data: data
        }
    }}
}


controller.getFeedback = async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let {opts, areaId, id, includeResponse} = req.query;
    if (opts === "list")
    {
        let data = await getFeedbackByArea(areaId);
        res.json(data);

    }
    else
    {
        await models.feedback.findOne({
            attributes:['id','name', 'email', 'phone', 'content', 'image1', 'image2', 'createdAt'],
            where: {id: id},
            include: [
                {model: models.place, attributes: ['address_formated'], as:'place', include: [{
                    model: models.area, attributes: ['formatedName']
                }]}
            ]
        }).then(async (data) => {
            if(includeResponse) {
                let fbRes = await getResponse(data.response_id);
                data.dataValues.responseFeedback = fbRes;
                res.json(data)
            }
            else{
                res.json(data);
            }
        }).catch((err) => res.json(err));
    }
}


// controller.getResponse = async (req, res) =>
// {
//     let {id} = req.query;
//     await models.feedback_response.findOne({
//         attributes: ['officer', 'createdAt', 'content'],
//         where: {id: id},
//         include: [
//             {model: models.account, attributes:['first_name', 'last_name']},
//         ]
//     }).then((data) => res.json(data)).catch((err) => res.json(err));
// }

module.exports = controller;