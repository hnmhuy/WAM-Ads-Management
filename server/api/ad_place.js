const controller = {} 
const models = require('../models');  
const Op = require('../models').Sequelize.Op;
const Sequelize = require('../models').Sequelize;
const { addPlace, updatePlace } = require('./place');  

const countAdContent = Sequelize.literal('(SELECT COUNT(*) FROM ad_contents WHERE ad_contents.ad_place_id = ad_place.id)');
const purposeQuery = Sequelize.literal('(SELECT name FROM categories WHERE categories.id = ad_place.purpose)');
const locationTypeQuery = Sequelize.literal('(SELECT name FROM categories WHERE categories.id = ad_place.location_type)');

async function createAdPlace(data) {
    try {
        let ad_place = await models.ad_place.create({
            capacity: data.capacity,
            image1: data.image1,
            image2: data.image2,
            place_id: data.place_id,
            location_type: data.location_type,
            purpose: data.purpose,
        })
        return ad_place.dataValues;
    } catch (error) {
        console.log(error);
        return null;
    }
}

controller.createAdPlace = async (req, res) => {
    // Create a place
    const placeData = {};
    placeData.geometry = req.body.geometry;
    placeData.address_formated = req.body.street;
    placeData.area_id = req.body['ward'];
    let placeRes = await addPlace(placeData);
    if(placeRes) {
        const data = {};
        data.capacity = req.body['ads-amount'];
        data.image1 = req.files[0] ? req.files[0].path : null;
        data.image2 = req.files[1] ? req.files[1].path : null;
        data.place_id = req.body.place_id;
        data.location_type = req.body['location-type'];
        data.purpose = req.body['purpose-type'];
        data.place_id = placeRes.id;
        let adPlaceRes = await createAdPlace(data);
        if (adPlaceRes) {
            res.json({
                success: true,
                message: "Create ad place success",
                data: {
                    ad: adPlaceRes,
                    place: placeRes
                }
            })
        } else {
            res.json({
                success: false,
                message: "Create ad place fail",
                data: null
            })
        }
    } else {
        res.json({
            success: false,
            message: "Create ad place fail",
            data: null
        })
    }

}

async function getAdPlace(limit = 10, page = 0, status = undefined, areaId = undefined, purpose = undefined, locationType = undefined, includeGeometry = false) {

    let level = 0;

    let attributes = ['id', 'address_formated'];
    if(includeGeometry) {
        attributes.push('geometry');
    }
    
    if (areaId) { 
        let area = await models.area.findOne({
            where: {
                id: `${areaId}`
            }
        })
        if (area) {
            if (area.parent_id) {
                level = 2;
            } else {
                level = 1;
            }
        }
    }

    console.log(level);
    console.log(areaId);

    try {
        let ad_place = await models.ad_place.findAndCountAll({
            attributes: [
                'id',
                'capacity',
                'status',
                [countAdContent, 'ad_amount'],
                [purposeQuery, 'purpose'],
                [locationTypeQuery, 'location_type'],
            ],
            include: [
                {
                    model: models.place,
                    attributes:attributes,
                    include: [
                        {model: models.area, attributes: ['id', 'name', 'formatedName', 'parent_id']}
                    ]
                }
            ],
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
            where: {
                [Op.and]: [
                    status ? {status: status} : null,
                    areaId ? level === 1 ? { '$place.area.parent_id$': `${areaId}` } : { '$place.area.id$': `${areaId}` } : null,
                    purpose ? {purpose: purpose} : null,
                    locationType ? {location_type: locationType} : null,
                ]
            }
        })
        return {
            success: true,
            message: "Get ad place success",
            data_length: ad_place.rows.length,
            data: ad_place,
        }
    } catch {
        return {
            success: false,
            message: "Get ad place fail",
            data: null
        }
    }
}

async function getOneAdPlace(id, includeAdContent=false) {
    try {
        let data = await models.ad_place.findOne({
            attributes: [
                'id',
                'capacity',
                'image1',
                'image2',
                'status',
                ['location_type', 'locationTypeId'],
                ['purpose', 'purposeId'],
                [purposeQuery, 'purpose'],
                [locationTypeQuery, 'location_type'],
            ],
            include: [
                {
                    model: models.place,
                    attributes: [
                        'id',
                        'address_formated',
                        'geometry',
                    ],
                    include: [
                        {model: models.area, attributes: ['id', 'name', 'formatedName', 'parent_id']}
                    ]
                }
            ],
            where: {
                id: id
            },
        });
        if (includeAdContent)
        {
            try
            {
                let adContents = await getAdContents(id)
                data.dataValues.adContents = adContents;
                data.dataValues.adContentCapacity = adContents.length
            }
            catch (err) {
                console.log(err);
            }
        }
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

controller.getAdPlace = async (req, res) => {
    let {limit, page, status, areaId, purpose, locationType, includeGeometry} = req.query;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    status = status ? status : undefined;
    areaId = areaId ? parseInt(areaId) : undefined;
    purpose = purpose ? parseInt(purpose) : undefined;
    locationType = locationType ? parseInt(locationType) : undefined;
    let adPlaceRes = await getAdPlace(limit, page, status, areaId, purpose, locationType, includeGeometry);
    if (adPlaceRes.success) {
        res.json(adPlaceRes);
    } else {
        res.json(adPlaceRes);
    }
}

controller.getOneAdPlace = async (req, res) => {
    let {id, includeAdContent} = req.query;
    console.log(id);
    let adPlaceRes = await getOneAdPlace(id, includeAdContent);
    if (adPlaceRes) {
        res.json({
            success: true,
            message: "Get ad place success",
            data: adPlaceRes
        })
    } else {
        res.json({
            success: false,
            message: "Get ad place fail",
            data: null
        })
    }
}

controller.deleteAdPlace = async (req, res) => {
    let id =  req.query.id;
    if(id === undefined) {
        res.json({
            success: false,
            message: "Please provide id",
            data: null
        })
    } else {
        try {
            let ad_place = await models.ad_place.findOne({
                where: {
                    id: id
                }
            });

            if(ad_place) {
                // Destroy the place first then destroy the ad_place
                let place = await models.place.destroy({
                    where: {
                        id: ad_place.place_id
                    }
                })

                let result = await models.ad_place.destroy({
                    where: {
                        id: id
                    }
                })
                if(result) {
                    res.json({
                        success: true,
                        message: "Delete ad place success",
                        data: null
                    })
                } else {
                    res.json({
                        success: false,
                        message: "Delete ad place fail",
                        data: null
                    })
                }
            }
        } catch (error) {
            
        }
    }
}

async function getAdPlaceAsGeojson(areaId = undefined) {
    try {

        let level = 0;
        if (areaId) { 
            let area = await models.area.findOne({
                where: {
                    id: `${areaId}`
                }
            })
            if (area) {
                if (area.parent_id) {
                    level = 2;
                } else {
                    level = 1;
                }
            }
        }


        let data = await models.ad_place.findAll({
            attributes: ['id', 'capacity', 'status'],
            include: [
                {
                    model: models.place,
                    attributes: ['id', 'address_formated', 'geometry'],
                    include: [
                        {model: models.area, attributes: ['id', 'name', 'formatedName', 'parent_id']}
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            where: {
                [Op.and]: [
                    areaId ? level === 1 ? { '$place.area.parent_id$': `${areaId}` } : { '$place.area.id$': `${areaId}` } : null,
                ]
            }
        })
        return {
            sucess: true,
            message: "Get ad place success",
            data: data
        }
    } catch (error) {
        return {
            sucess: false,
            message: "Get ad place fail",
            data: null,
            detail: error
        }
    }
}

function toGeojson(data) {
    let res = {}
    res.type = "FeatureCollection";
    res.features = [];
    data.forEach(item => {
        let feature = {};
        feature.type = "Feature";
        feature.geometry = JSON.parse(item.place.geometry);
        feature.properties = {
            id: item.id,
            capacity: item.capacity,
            status: item.status,
            address_formated: item.place.address_formated,
            area: item.place.area,
        }
        res.features.push(feature);
    })
    // console.log(res);
    return res;
}

controller.getAdPlaceGeojson = async (req, res) => {
    let {areaId} = req.query;
    let data = await getAdPlaceAsGeojson(areaId);
    if(data.sucess) {
        // Json data values of the ad_place
        let jsonData = data.data.map(item => item.get({plain: true}));
        // Convert json data to geojson
        let geojson = toGeojson(jsonData);
        data.data = geojson;
        res.json(data);
    } else {
        res.json(data);
    }
}

controller.updateAdPlace = async (req, res) => {
    const newPlaceData = {
        geometry: req.body.geometry,
        address_formated: req.body.street,
        area_id: req.body['ward'],
        id: req.body.place_id,
    }
    try {
        let updatePlaceRes = await updatePlace(newPlaceData);
        if(updatePlaceRes[0]) {
            const newAdPlaceData = {
                capacity: req.body['new-amount'],
                location_type: req.body['location-type'],
                purpose: req.body['purpose-type'],
                status: req.body['new-location-status'] === 'true' ? true : req.body['new-location-status'] === 'false' ? false : null,
                place_id: req.body.place_id,    
            }
            let updateAdPlaceRes = await models.ad_place.update({
                capacity: newAdPlaceData.capacity,
                location_type: newAdPlaceData.location_type,
                purpose: newAdPlaceData.purpose,
                status: newAdPlaceData.status,
            }, {
                where: {
                    id: req.body.id
                }
            })

            if(updateAdPlaceRes[0]) {
                let data = await getOneAdPlace(req.body.id);
                res.json({
                    success: true,
                    message: "Update place success",
                    data: data
                })
            } else {
                res.json({
                    success: false,
                    message: "Update place fail",
                    data: null
                })
            }

        } else {
            res.json({
                success: false,
                message: "Update place fail",
                data: null
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error,
            data: null
        })
    }
}



async function getAdContents(placeId)
{
    try
    {
        const currentDate = new Date();
        let data = await models.ad_content.findAll({
            attributes: ['width', 'height', 'start', 'end', 'status', 'image1', 'image2'],
            where: {
                ad_place_id: placeId,
                status: true,
                start: {[Op.lte]: currentDate},
                end: {[Op.gte]: currentDate},
            },
            include: [{model: models.category, attributes:['name'], where: {field_id: 'T3'}}]
        });
        return data;
    }catch(err)
    {
        console.log(err);
        return null;
    }
}










module.exports = controller;