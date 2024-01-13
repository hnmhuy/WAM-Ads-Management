const controller = {}
const models = require('../../models');
const sequelize = require('sequelize')

controller.show = async (req, res) => {
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Xử lý báo cáo";
    let delegation = req.session.user.delegation;

    let option = {
        attributes: ['id', 'name', 'email', 'phone', 'status', 'content', 'image1', 'image2', 'ad_id'],
        include: [
            {
                model: models.place,
                as: "place",
                attributes: ['address_formated'],
                include: [
                    {
                        model: models.area,
                        as: "area",
                        attributes: ['formatedName'],
                        where: {}
                    },
                ],
                where: {}
            },
            {
                model: models.feedback_response,
                as: "feedback_response",
                attributes: ['content', 'updatedAt'],
            },
            {
                model: models.category,
                as: "category",
                attributes: ['name']
            }
        ]
    }

    if (req.session.user.areaLevel == 1) {
        option.include[0].include[0].where.parent_id = delegation
    }
    if (req.session.user.areaLevel == 2) {
        option.include[0].where.area_id = delegation
    }

    let data_rows = await models.feedback.findAll(option).then((data) => {
        let data_row = []
        data.forEach((item) => {
            let tmp = {}
            tmp.id = item.id;
            tmp.type = item.category.name;
            tmp.content = item.content;

            if (item.feedback_response !== null) {
                tmp.solution = item.feedback_response.content;
                tmp.status = {
                    "status_id": "solved",
                    "status_name": "Đã giải quyết"
                }


                let curTime = new Date(item.feedback_response.updatedAt);
                let date = `${curTime.toLocaleTimeString('en-US', { hour12: true })} ${curTime.toLocaleDateString('en-GB')}`
                tmp.time = date;
            }
            else {
                tmp.solution = null;
                tmp.time = null;
                tmp.status = {
                    "status_id": "unsolved",
                    "status_name": "Chưa giải quyết"
                }
            }

            tmp.name = item.name;
            tmp.phone = item.phone;
            tmp.email = item.email;

            tmp.category = "is_random collapse";

            // if (item.ad_id !== null) {
            //     tmp.category = "is_not_random";
            // }


            tmp.image_path = [];

            if (item.image1 !== null) {
                tmp.image_path.push(item.image1);
            }

            if (item.image2 !== null) {
                tmp.image_path.push(item.image2);
            }

            let ward_district = item.place.area.formatedName.split(', ');
            tmp.address = {
                "street": item.place.address_formated,
                "ward": ward_district[0],
                "district": ward_district[1]
            }

            if (item.ad_id == null)
                data_row.push(tmp)

        });
        return data_row

    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })

    let fbData;

    if (req.session.user.areaLevel == 1) {
        fbData = await models.sequelize.query(
            'SELECT feedbacks.id, feedbacks.name,feedbacks.phone, feedbacks.email, feedbacks.status, feedbacks.content, feedbacks.image1, feedbacks.image2, areas."formatedName", places.address_formated, feedback_responses.content, feedback_responses."updatedAt", categories.name as type, feedbacks.response_id FROM feedbacks JOIN ad_contents ON feedbacks.ad_id = ad_contents.id JOIN ad_places ON ad_contents.ad_place_id = ad_places.id JOIN places ON ad_places.place_id = places.id JOIN areas ON areas.id = places.area_id LEFT JOIN feedback_responses ON feedback_responses.id = feedbacks.response_id JOIN categories ON categories.id = feedbacks.type WHERE areas.parent_id = $1 ',
            {
                bind: [req.session.user.delegation],
                type: models.Sequelize.QueryTypes.SELECT
            }
        )
    } else if (req.session.areaLevel == 2) {
        fbData = await models.sequelize.query(
            'SELECT feedbacks.id, feedbacks.name, feedbacks.phone, feedbacks.email, feedbacks.status, feedbacks.content, feedbacks.image1, feedbacks.image2, areas."formatedName", places.address_formated, feedback_responses.content, feedback_responses."updatedAt", categories.name as type, feedbacks.response_id FROM feedbacks JOIN ad_contents ON feedbacks.ad_id = ad_contents.id JOIN ad_places ON ad_contents.ad_place_id = ad_places.id JOIN places ON ad_places.place_id = places.id JOIN areas ON areas.id = places.area_id LEFT JOIN feedback_responses ON feedback_responses.id = feedbacks.response_id JOIN categories ON categories.id = feedbacks.type WHERE areas.id = $1',
            {
                bind: [req.session.user.delegation],
                type: models.Sequelize.QueryTypes.SELECT
            }
        )
    }
    if (fbData == null) {
        fbData = []
    }
    fbData.forEach(item => {
        let tmp = {}
        tmp.id = item.id;
        tmp.content = item.content;

        tmp.image_path = [];

        if (item.image1 !== null) {
            tmp.image_path.push(item.image1);
        }

        if (item.image2 !== null) {
            tmp.image_path.push(item.image2);
        }

        tmp.category = "is_not_random"

        let ward_district = item.formatedName.split(', ');
        tmp.address = {
            "street": item.address_formated,
            "ward": ward_district[0],
            "district": ward_district[1]
        }

        if (item.response_id !== null) {
            tmp.solution = item.content;
            tmp.status = {
                "status_id": "solved",
                "status_name": "Đã giải quyết"
            }


            let curTime = new Date(item.updatedAt);
            let date = `${curTime.toLocaleTimeString('en-US', { hour12: true })} ${curTime.toLocaleDateString('en-GB')}`
            tmp.time = date;
        }
        else {
            tmp.solution = null;
            tmp.time = null;
            tmp.status = {
                "status_id": "unsolved",
                "status_name": "Chưa giải quyết"
            }
        }

        tmp.name = item.name;
        tmp.phone = item.phone;
        tmp.email = item.email;
        tmp.type = item.type;
        data_rows.push(tmp)
    })

    res.locals.data_rows = data_rows
    res.render('district/reports', { layout: 'district_layout' });
}


module.exports = controller