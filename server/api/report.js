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
            // tmp.name = item.name == null ? "" : item.name;
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

// controller.updateSolution = (req, res) => {
//     let { solution, feedback_id, officer } = req.body;
//     let res_id = ""
//     model.feedback_response.create({
//         content: solution,
//         officier: officer
//     }).then((data) => {
//         res_id = data
//         res.json({
//             message: "Create response_feedback",
//             data: data
//         })
//     }).catch((err) => {
//         res.status(500).json({
//             message: err.message,
//         });
//         console.log(err);
//     })

//     model.feedback.update({
//         response_id: res_id
//     }, {
//         where: {
//             id: feedback_id
//         }
//     }).then((data) => {
//         res.json({
//             message: "Update feedback!",
//             data: data
//         })
//     }).catch((err) => {
//         res.status(500).json({
//             message: err.message,
//         });
//         console.log(err);
//     })

// }

controller.createResponse = (req, res) => {
    console.log(req.body)
    let { content, officer } = req.body;
    models.feedback_response.create({
        content: content,
        officer: officer
    }).then((data) => {
        res.json({
            message: "Create category successfully",
            data: data
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}

controller.updateFeedback = (req, res) => {
    const { fb_id, fbRes_id } = req.body;
    console.log(fb_id)
    console.log(fbRes_id)
    models.feedback.update({
        response_id: fbRes_id,
    }, {
        where: {
            id: fb_id
        }
    }).then((data) => {
        res.json({
            message: "Update successfully",
            data: data
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}
module.exports = controller;