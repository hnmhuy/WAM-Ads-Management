const controller = {}
const models = require('../models')
const Sequelize = models.Sequelize;
const Op = Sequelize.Op;

function toGeoJsonForAdPlace(data) {
    return {
        type: 'Feature',
        geometry: JSON.parse(data.geometry),
        properties: {
            isReported: data.isReported,
            category: data.category,
            icon: data.icon,
            status: data.status,
            placeid: data.placeid,
            detail: {
                dataid: data.dataid,
                status: data.status,
                status_VN: data.status_VN,
                purpose: data.purpose,
                type_of_ad: data.type_of_ad,
                number_feedback: data.number_of_feedback,
                address: data.address
            }
        }
    }
}

function toGeoJsonForFeedback(data) {
    return {
        type: 'Feature',
        geometry: JSON.parse(data.geometry),
        properties: {
            isReported: data.isReported,
            category: data.category,
            icon: `fb-${data.feedback_type_EN}`,
            status: data.status,
            placeid: data.placeid,
            detail: {
                dataid: data.dataid,
                status: data.status,
                status_VN: data.status_VN,
                feedback_type_EN: data.feedback_type_EN,
                feedback_type_VN: data.feedback_type_VN,
            }
        }
    }
}

function toGeoJson(data) {
    return {
        type: 'FeatureCollection',
        features: data.map(item => {
            if (item.category === 'ad') {
                return toGeoJsonForAdPlace(item);
            } else if (item.category === 'fb') {
                return toGeoJsonForFeedback(item);
            }
        })
    }
}

async function getAdPlaceGeoJson(delegation = "", areaLevel = "") {
    try {
        let option = {
            attributes: [
                [Sequelize.literal('place.geometry'), 'geometry'],
                [Sequelize.literal('place.id'), 'placeid'],
                [Sequelize.literal("'ad'"), 'category'],
                [Sequelize.literal('FALSE'), 'isReported'],
                [Sequelize.literal("CASE WHEN (SELECT COUNT(*) FROM ad_contents ac WHERE ac.ad_place_id = ad_place.id) > 0 THEN 'ad' ELSE 'ad-none' END"), 'icon'],
                [Sequelize.literal("CASE WHEN ad_place.status = true THEN 'active' ELSE 'inactive' END"), 'status'],
                [Sequelize.literal('ad_place.id'), 'dataid'],
                [Sequelize.literal("CASE WHEN ad_place.status = true THEN 'Đã quy hoạch' ELSE 'Chưa quy hoạch' END"), 'status_VN'],
                [Sequelize.literal('(SELECT name FROM categories c WHERE c.id = ad_place.purpose)'), 'purpose'],
                [Sequelize.literal('(SELECT name FROM categories c WHERE c.id = ad_place.location_type)'), 'type_of_ad'],
                [Sequelize.literal('(SELECT COUNT(*) FROM feedbacks f WHERE f.ad_id = ad_place.id)'), 'number_of_feedback'],
                [Sequelize.literal('place.address_formated || \', \' || "place->area"."formatedName"'), 'address']
            ],
            include: [
                {
                    model: models.place,
                    attributes: [],
                    include: [
                        {
                            model: models.area,
                            attributes: [],
                            where: {}
                        }
                    ],
                    where: {}
                }
            ],
            raw: true
        }

        if (delegation !== "") {

            if (areaLevel == 1) {
                option.include[0].include[0].where.parent_id = delegation
            }
            if (areaLevel == 2) {
                option.include[0].where.area_id = delegation
            }
        }
        let data = await models.ad_place.findAll(option)
        return {
            success: true,
            data: data
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error
        }
    }
}

async function getFeedbackGeoJson(delegation = "", areaLevel = "") {
    try {

        let option = {
            attributes: [
                [Sequelize.literal('place.geometry'), 'geometry'],
                [Sequelize.literal('TRUE'), 'isReported'],
                [Sequelize.literal("'fb'"), 'category'],
                [Sequelize.literal('place.id'), 'placeid'],
                [Sequelize.literal('feedback.status'), 'status'],
                [Sequelize.literal("case when feedback.status = 'sent' then 'Đã gửi' when feedback.status = 'done' then 'Đã xử lý' end"), 'status_VN'],
                [Sequelize.literal("case when category.name = 'Đóng góp ý kiến' then 'feedback' when category.name = 'Tố giác sai phạm' then 'report' when category.name = 'Giải đáp thắc mắc' then 'question' when  category.name = 'Đăng ký nội dung' then 'registry' end"), 'feedback_type_EN'],
                [Sequelize.literal('category.name'), 'feedback_type_VN'],
                [Sequelize.literal('feedback.id'), 'dataid'],
                [Sequelize.literal('place.geometry'), 'geometry'],
            ],
            include: [
                {
                    model: models.place,
                    attributes: [],
                    include: [
                        {
                            model: models.area,
                            where: {}
                        }
                    ],
                    where: {}
                },
                { model: models.category, attributes: [] },
            ],
            where: {
                place_id: {
                    [Op.ne]: null
                }
            },
            raw: true
        }

        if (delegation !== "") {

            if (areaLevel == 1) {
                option.include[0].include[0].where.parent_id = delegation
            }
            if (areaLevel == 2) {
                option.include[0].where.area_id = delegation
            }
        }
        let data = await models.feedback.findAll(option)
        return {
            success: true,
            data: data
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error
        }
    }
}

controller.get = async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let adData = await getAdPlaceGeoJson();
    let fbData = await getFeedbackGeoJson();
    let data = undefined;
    if (adData.success) {
        data = adData.data;
    }
    if (fbData.success) {
        data = data.concat(fbData.data);
    }
    res.json({
        success: true,
        data: toGeoJson(data)
    })
}

controller.getData = async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let delegation = req.session.user.delegation;
    let areaLevel = req.session.user.areaLevel;
    console.log(delegation)
    let adData = await getAdPlaceGeoJson(delegation, areaLevel);
    let fbData = await getFeedbackGeoJson(delegation, areaLevel);
    let data = undefined;
    if (adData.success) {
        data = adData.data;
    }
    if (fbData.success) {
        data = data.concat(fbData.data);
    }
    res.json({
        success: true,
        data: toGeoJson(data)
    })
}

controller.getOnlyAd = async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let adData = await getAdPlaceGeoJson();
    let data = undefined;
    if (adData.success) {
        data = adData.data;
    }
    res.json({
        success: true,
        data: toGeoJson(data)
    })
}

controller.restoreUserFeedback = async (req, res) => { 
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let userFeedbacks = JSON.parse(req.body.feedbackList);
    let randomFeedbacks = userFeedbacks.filter(item => item.type === 'random');
    
    // Convert randomFeedbacks to list of place_id
    let randomPlaceIds = randomFeedbacks.map(item => item.place_id);

    // Get the feedbacks randomly
    let random = await models.feedback.findAll({
        attributes: [
            [Sequelize.literal('place.geometry'), 'geometry'],
            [Sequelize.literal('TRUE'), 'isReported'],
            [Sequelize.literal("'fb'"), 'category'],
            [Sequelize.literal('place.id'), 'placeid'],
            [Sequelize.literal('feedback.status'), 'status'],
            [Sequelize.literal("case when feedback.status = 'sent' then 'Đã gửi' when feedback.status = 'done' then 'Đã xử lý' end"), 'status_VN'],
            [Sequelize.literal("case when category.name = 'Đóng góp ý kiến' then 'feedback' when category.name = 'Tố giác sai phạm' then 'report' when category.name = 'Giải đáp thắc mắc' then 'question' when  category.name = 'Đăng ký nội dung' then 'registry' end"), 'feedback_type_EN'],
            [Sequelize.literal('category.name'), 'feedback_type_VN'],
            [Sequelize.literal('feedback.id'), 'dataid'],
            [Sequelize.literal('place.geometry'), 'geometry'],
        ],
        include: [
            {
                model: models.place,
                attributes: [],
                include: [
                    {
                        model: models.area,
                        where: {}
                    }
                ],
                where: {}
            },
            { model: models.category, attributes: [] },
        ],
        where: {
            place_id: {
                [Op.in]: randomPlaceIds
            }
        },
        raw: true
    });

    res.json({message: "success", data: toGeoJson(random)});
}

module.exports = controller;