'use strict'

const controller = {};
const models = require('../models');
const {sendEmail} = require('../controllers/otp.controller')


controller.getReports = (req, res) => {
    let delegation = req.query.delegation;
    models.feedback.findAll({
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
                        attributes: ['formatedName']
                    },
                ],
                where: {
                    area_id: delegation
                }
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
        })

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

controller.updateSolution = (req, res) => {
    let { solution, feedback_id, officer } = req.body;
    let res_id = ""
    model.feedback_response.create({
        content: solution,
        officier: officer
    }).then((data) => {
        res_id = data
        res.json({
            message: "Create response_feedback",
            data: data
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })

    model.feedback.update({
        response_id: res_id
    }, {
        where: {
            id: feedback_id
        }
    }).then((data) => {
        res.json({
            message: "Update feedback!",
            data: data
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })

}

controller.createResponse = (req, res) => {
    console.log(req.body)

    let officer = (req.session.user.id)
    console.log(officer)

    let { content } = req.body;
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
    models.feedback.update({
        status: "done",
        response_id: fbRes_id,
    }, {
        where: {
            id: fb_id
        }
    }).then( async (data) => {
        try {
            const feedback = await models.feedback.findByPk(fb_id);
            const response = await models.feedback_response.findByPk(fbRes_id);
            if(feedback && response){
                const mailOptions = {
                    from: "wam21KTPM@hotmail.com",
                    to: feedback.email,
                    subject: "[THÔNG BÁO] - HƯỚNG GIẢI QUYẾT BÁO CÁO",
                    html: `
                    Kính gửi ông/bà ${feedback.name},

                    <p>Sau khi xem xét kĩ báo cáo của quý ông/bà gửi về, chúng tôi xin được phép tường trình với ông/bà về cách giải quyết như sau.</p>

                    <p>${response.content}</p>

                    <p>Xin cảm ơn ông/bà đã dành đóng góp cho trang thông tin của chúng tôi để trang ngày càng hoàn thiện hơn.</p>
                    <p>Thân.</p>
                    `
                }
                await sendEmail(mailOptions);
                res.json({
                    message: "Update successfully",
                    data: data
                })
            }
        } catch (error) {
            res.status(500).json({
                message: err.message,
            });
            console.log(err);
        }
        
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}
module.exports = controller;