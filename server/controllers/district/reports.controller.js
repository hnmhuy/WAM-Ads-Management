const controller = {}
const models = require('../../models');
const splitAddressFormatted = (address_formatted) => {
    let address_part = {
        street: '',
        ward: '',
        district: ''
    }

    const addressParts = address_formatted.split(', ')
    address_part.street = addressParts[0];
    address_part.ward = addressParts[1];
    address_part.district = addressParts[2];
    return address_part
}

controller.show = async (req, res) => {
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Danh sách cấp phép";

    let data_rows = await models.feedback.findAll({
        attributes: ['id', 'name', 'email', 'phone', 'status', 'content', 'image1', 'image2'],
        include: [
            {
                model: models.place,
                as: "place",
                attributes: ['address_formated']
            },
            {
                model: models.feedback_response,
                as: "feedback_response",
                attributes: ['content', 'updatedAt']
            },
            {
                model: models.category,
                as: "category",
                attributes: ['name']
            }
        ]
    }).then((data) => {
        let data_row = [];

        data.forEach((item) => {
            let tmp = {};
            tmp.id = item.id;
            tmp.type = item.category.name;
            tmp.content = item.content


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
            tmp.name = item.name == null ? "" : item.name;
            tmp.phone = item.phone || "";
            tmp.email = item.email || "";

            tmp.address = splitAddressFormatted(item.place.address_formated);
            tmp.image_path = [];

            if (item.image1 !== null) {
                tmp.image_path.push(item.image1);
            }

            if (item.image2 !== null) {
                tmp.image_path.push(item.image2);
            }

            tmp.category = "";

            if (item.ad_id !== null) {
                tmp.category = "is_not_random";
            }

            if (item.place !== null) {
                tmp.category = "is_random collapse";
            }
            data_row.push(tmp);

        });
        console.log(data_row)
        return data_row

    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
    console.log(data_rows)
    res.locals.data_rows = data_rows
    res.render('district/reports', { layout: 'district_layout' });
}


module.exports = controller