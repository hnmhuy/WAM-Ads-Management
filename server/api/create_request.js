const controller = {}
const models = require('../models');
const Op = require('../models').Sequelize.Op;
const Sequelize = require('../models').Sequelize;
const purposeQuery = Sequelize.literal('(SELECT name FROM categories WHERE categories.id = ad_place.purpose)');
const locationTypeQuery = Sequelize.literal('(SELECT name FROM categories WHERE categories.id = ad_place.location_type)');

controller.getAmountByAdPlace = async (req, res) => {
    try {
        let data = await models.ad_place.findAll({
            attributes: [
                'id',
                [Sequelize.fn('COUNT', Sequelize.col('ad_contents.id')), 'amount_req']
            ],
            include: [
                {
                    model: models.ad_content,
                    as: 'ad_contents',
                    attributes: [],
                    where: {
                        status: {[Op.is]: null}
                    },
                },
            ],
            group: ['ad_place.id'],
            having: Sequelize.literal('COUNT(ad_contents.id) > 0')
        })
        let rawData = data.map(item => item.get({ plain: true }))
        // Loop through the data and get more information
        for (let i=0; i < rawData.length; i++) {
            let place = await models.ad_place.findOne({
                where: {
                    id: rawData[i].id
                },
                include: [
                    {
                        model: models.place,
                        as: 'place',
                        attributes: ['address_formated'],
                        include: [
                            {model: models.area, attributes: ['name', 'formatedName', 'parent_id']},
                        ]
                    },
                ],
                attributes: ['id', 'status', 'purpose', 'location_type', 'place_id', [purposeQuery, 'purpose_name'], [locationTypeQuery, 'location_type_name']]
            })
           rawData[i].place = place;
        }
        res.json({
            success: true,
            message: "Success",
            data: rawData
        })
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }

}

controller.getListOfRequest = async (req, res) => {
    let placeId = req.query.placeId;
    try {
        let data = await models.create_request.findAll({
            attributes: ['id', 'officer', 'createdAt', 'status', 'ad_id'],
            include: [
                {
                    model: models.ad_content,
                    attributes: [],
                    where: {
                        ad_place_id: placeId, 
                        status: {[Op.is]: null}
                    },
                },
                {
                    model: models.account,
                    attributes: ['first_name', 'last_name']
                }
            ],
        })
        res.json({
            success: true,
            message: "Success",
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    } 
}

controller.getOneRequest = async (req, res) => {
    try {
        let id = req.query.id;
        let data = await models.create_request.findOne({
            attributes: ['id', 'officer', 'createdAt', 'status', 'ad_id'],
            include: [
                {
                    model: models.ad_content,
                    attributes: ['company_name', 'status', 'company_email', 'company_address', 'description', 'height', 'width', 'start', 'end', 'image1', 'image2', 'ad_place_id', 'ad_type'],
                },
                {
                    model: models.account,
                    attributes: ['first_name', 'last_name']
                }
            ],
            where: {
                id: id
            }
        })
        res.json({
            success: true,
            message: "Success",
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

controller.resolveRequest = async (req, res) => {
    let {reqId, adId, isApproved} = req.body;
    isApproved = isApproved === 'true' ? true : false;
    try {
        let requestRes = await models.create_request.update({
            status: isApproved ? 'accepted' : 'cancel'
        }, 
        {
            where: {
                id: reqId
            }
        })
        let adRes = await models.ad_content.update({
            status: isApproved
        }, 
        {
            where: {
                id: adId
            }
        })
        res.json({
            success: true,
            message: "Success",
            data: {
                requestRes,
                adRes
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

module.exports = controller;