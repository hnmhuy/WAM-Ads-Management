const controller = {}
const models = require('../../models');

controller.show = async (req, res) => {
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Xử lý báo cáo";
    let delegation = req.session.user.delegation;

    let option = {
        attributes: ['id', 'name', 'email', 'phone', 'status', 'content', 'image1', 'image2'],
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
                tmp.time = item.feedback_response.updatedAt;
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

            tmp.category = "";

            if (item.ad_id !== null) {
                tmp.category = "is_not_random";
            }

            if (item.place !== null) {
                tmp.category = "is_random collapse";
            }

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

            data_row.push(tmp)

        });
        console.log(data_row)
        return data_row

    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
    res.locals.data_rows = data_rows
    res.render('district/reports', { layout: 'district_layout' });
}


module.exports = controller