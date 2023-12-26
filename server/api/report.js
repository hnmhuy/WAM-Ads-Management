'use strict'

const controller = {};
const models = require('../models');
const splitAddressFormatted = (address_formatted) => {
    let address_part = {
        street: '',
        ward: '',
        district: ''
    }

    if (address_formatted != null) {

        const addressParts = address_formatted.split(', ')
        address_part.street = addressParts[0];
        address_part.ward = addressParts[1];
        address_part.district = addressParts[2];
    }
    return addressParts
}


controller.getReports = (req, res) => {
    models.feedback.findAll({
        attributes: ['name', 'email', 'phone', 'status', 'content', 'image1', 'image2'],
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
            tmp.id = item.id || "";
            tmp.type = item.category.name || "";

            // if (item.feedback_response !== null) {
            //     tmp.solution = item.feedback_response.content || "";
            //     tmp.time = item.feedback_response.updatedAt || "";
            // }
            tmp.name = item.name || "";
            tmp.phone = item.phone || "";
            tmp.email = item.email || "";
            // tmp.address = splitAddressFormatted(item.place.address_formated);
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

        res.json({
            data_row: data_row
        });
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}

module.exports = controller;