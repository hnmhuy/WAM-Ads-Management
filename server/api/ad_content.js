const controller = {}
const models = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const queryAdType = Sequelize.literal(`(SELECT name FROM categories WHERE categories.id = ad_content.ad_type)`);

controller.getByAdPlace = async (adId) => {
    try {
        let data = await models.ad_content.findAll({
            attributes: [
                'id',
                'company_name',
                'width',
                'height',
                'description',
                'status',
                'image1',
                'image2',
                'start',
                'end',
                'ad_type',
                [queryAdType, 'ad_type_name']
            ]
            , where: {
                ad_place_id: adId
            }
        })
        return {
            success: true,
            message: 'Get ad content successfully',
            data: data
        }
    } catch(error) {
        console.log(error);
        return {
            success: false,
            message: 'Get ad content failed',
            error: error
        }
    }
}

controller.get  = async (req, res) => {
    res.json(await controller.getByAdPlace(req.query.adPlaceId));
}

module.exports = controller;