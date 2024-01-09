const controller = {}
const models = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const queryAdType = Sequelize.literal(`(SELECT name FROM categories WHERE categories.id = ad_content.ad_type)`);

controller.getOne = async (id) =>  {
    try {
        let data = await models.ad_content.findOne({
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
                id: id
            }
        })
        return {
            success: true,
            message: 'Get ad content successfully',
            data: data
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Get ad content failed',
            error: error
        }
    }
}

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

controller.update = async (req, res) => {
    console.log(req.body);
    let {id, company_name, width, height, start, end} = req.body;
    let resStatus = req.body.res;
    try { 
        let data = await models.ad_content.update({
            company_name: company_name,
            width: width,
            height: height,
            start: start,
            end: end
        }, {
            where: {
                id: id
            }
        })
        if (data) {
            if(resStatus) {
                resStatus = resStatus === 'true' ? true : resStatus === 'false' ? false : null;
                // Find the create request
                let createRequest = await models.create_request.findOne({
                    where: {
                        ad_id: id
                    }
                })
                console.log(createRequest);
                if(createRequest) {
                    await models.create_request.update({
                        status: resStatus ? 'accepted' : 'cancel'
                    }, {
                        where: { id : createRequest.id }
                    })
                    await models.ad_content.update({
                        status: resStatus
                    }, {
                        where: { id : id }
                    })
                }
            }

            let adContent = await controller.getOne(id);
            if(adContent.success) {
                res.json({
                    success: true,
                    message: 'Update ad content successfully',
                    data: adContent.data
                })   
            } else {
                res.json({
                    success: false,
                    message: 'Update ad content failed',
                    error: adContent.error
                })
            }                
        } else {
            res.json({
                success: false,
                message: 'Update ad content failed',
                data: null
            })
        }
    } catch(error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Update ad content failed',
            error: error
        })
    }
}

controller.get  = async (req, res) => {
    res.json(await controller.getByAdPlace(req.query.adPlaceId));
}

controller.getOneAdContent = async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let {id} = req.query;
    try
    {
        let data = await models.ad_content.findOne({
            attributes: ['id','company_name', 'width', 'height', 'start', 'end', 'image1', 'image2'],
            include: [
                {model: models.category, attributes:['name']},
                {model: models.ad_place, attributes: ['id', 'purpose', 'location_type'], include:[
                    {model: models.place, attributes:['address_formated'], include:[{model: models.area, attributes: ['formatedName']}]}]},
                ],
            where: {id: id},
        })
        if(data)
        {
            let purposeId = data.dataValues.ad_place.purpose;
            let locationId = data.dataValues.ad_place.location_type;
            console.log(purposeId);
            let purposeData = await models.category.findOne({
                attributes: ['name'],
                where: {id: purposeId}
            })
            let locationData = await models.category.findOne({
                attributes: ['name'],
                where: {id: locationId}
            })
            data.dataValues.purpose = purposeData.dataValues.name;
            data.dataValues.location = locationData.dataValues.name;
            res.json({
                success: true,
                message: 'Update ad content successfully',
                data: data
            })   
        }
        else
        {
            res.json({
                success: false,
                message: 'Update ad content failed',
                data: null
            })
        }
    } catch(err)
    {
        res.json({
            success: false,
            message: 'Fetch ad content failed',
            error: err
        })
    }

}

module.exports = controller;