const controller = {};
const models = require("../models");
const Sequelize = models.Sequelize;


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
    let data ;
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let fileList = req.files;
    let typeFeedback = undefined;
    let geojsonId = undefined;
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

    let {email, name, phone, mytextarea, type, ad_place, ad_content,ward, geometry, formatedAddress} = req.body;
    try {
        if (!ad_place && !ward)
        {
            feedbackType = 'ad_content'
            data = await models.feedback.create({
                name: name,
                email: email,
                phone: phone,
                content: mytextarea,
                type: type,
                image1: img1,
                image2: img2,
                ad_id: ad_content,
            })

            let temp = await models.ad_content.findOne({
                include: [
                    {model: models.ad_place, attributes: ['place_id']}
                ],
                where: {
                    id: ad_content
                },
                attributes: ['id']
            })
            console.log(temp);
            geojsonId = temp.dataValues.ad_place.place_id;

        }
        else if(ad_place && !ward)
        {
            feedbackType = 'ad_place'
            const placeId = await isAdPlaceExist(ad_place);
            if (placeId)
            {
                geojsonId = placeId.place_id
                data = await models.feedback.create({
                    name: name,
                    email: email,
                    phone: phone,
                    content: mytextarea,
                    type: type,
                    image1: img1,
                    image2: img2,
                    place_id: placeId.dataValues.place_id,
                })
            // console.log("this is feedbackID: ", data);
            }
        }
        else if(ward)
        {
            feedbackType = 'random'
            let placeId = await isWardExist(ward, geometry, formatedAddress);
            if(placeId)
            {
                geojsonId = placeId.id
                data = await models.feedback.create({
                    name: name,
                    email: email,
                    phone: phone,
                    content: mytextarea,
                    type: type,
                    image1: img1,
                    image2: img2,
                    place_id: placeId.id,
                })
            }
        
        }


        // feedbackId = data.id;

        // console.log("This is req", req.files);

        let responseData = {
            feedback_id: data.id,
            ad_id: data.ad_id,
            place_id: data.place_id,
            type: feedbackType,
            geojsonId: geojsonId
        }
        
        res.json({success: true, message: 'Received feedback successfully!', data: responseData});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error});
    }
    
}

async function isAdPlaceExist(placeId) {
    try{
        let place = await models.ad_place.findOne({
            where: { id: placeId},
            attributes: ['place_id']
        });
        return place;
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
    
}

async function isWardExist(ward, geometry, formatedAddress)
{
    let data = await models.area.findOne({
        where: {name: ward},
        attributes: ['id']
    })
    if (data)
    {
        let temp = JSON.parse(geometry);
        temp.coordinates[0] = parseFloat(temp.coordinates[0]);
        temp.coordinates[1] = parseFloat(temp.coordinates[1]);
        
        let createData = await models.place.create({
            geometry: JSON.stringify(temp),
            area_id: data.dataValues.id,
            address_formated: formatedAddress,
        })
        return {id: createData.dataValues.id};
    }
    else
        return null;
}

controller.verifyPlace = async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let ward = req.query.ward;
    let data = await models.area.findOne({
        where: {name: ward},
        attributes: ['id']
    })

    if(data) {
        res.json({success: true, message: "Ward is valid"});
    } else {
        res.json({success: false, message: "Ward is invalid"})
    }
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
            attributes:['id','name', 'email', 'phone', 'content', 'image1', 'image2', 'createdAt',
            [Sequelize.literal('feedback.status'), 'status'],
            [Sequelize.literal("case when feedback.status = 'sent' then 'Đã gửi' when feedback.status = 'done' then 'Đã xử lý' end"), 'status_VN'],
            [Sequelize.literal("case when category.name = 'Đóng góp ý kiến' then 'feedback' when category.name = 'Tố giác sai phạm' then 'report' when category.name = 'Giải đáp thắc mắc' then 'question' when  category.name = 'Đăng ký nội dung' then 'registry' end"), 'feedback_type_EN'],
            [Sequelize.literal('category.name'), 'feedback_type_VN'],    
        ],
            where: {id: id}, 
            include: [
                {model: models.place, attributes: ['address_formated'], as:'place', include: [{
                    model: models.area, attributes: ['formatedName']
                }]},
                { model: models.category, attributes: [] },
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


controller.getFeedbackOfAdPlace = async(req, res)=>{
    let {ad_place} = req.query;
    let data = await models.sequelize.query('SELECT feedbacks.*, feedback_responses.content as response_content, accounts.first_name, accounts.last_name FROM feedbacks LEFT JOIN feedback_responses ON feedback_responses.id = feedbacks.response_id LEFT JOIN accounts ON accounts.id = feedback_responses.officer WHERE feedbacks.place_id = $1',
    { 
        bind: [ad_place], 
        type: models.Sequelize.QueryTypes.SELECT 
    });
    res.json(data);
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