'use strict'

const models = require('../models');
const controller = {}

controller.createUpdateRequestAdPlace = (req, res) => {
    let officer = (req.session.user.id)
    console.log(officer)
    let { request_data, status, ad_place_id } = req.body;
    models.update_request.create({
        resquest_data: request_data,
        status: status,
        officer: officer,
        ad_place_id: ad_place_id
    }).then((data) => {
        res.json({
            message: "Create update request successfully",
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