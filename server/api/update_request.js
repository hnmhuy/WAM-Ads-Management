'use strict'

const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const Sequelize = require('../models').Sequelize;
const controller = {}
const purposeQuery = Sequelize.literal('(SELECT name FROM categories WHERE categories.id = ad_place.purpose)');
const locationTypeQuery = Sequelize.literal('(SELECT name FROM categories WHERE categories.id = ad_place.location_type)');

controller.createUpdateRequestAdPlace = (req, res) => {
    let officer = (req.session.user.id)
    console.log(officer)
    let { request_data, status, ad_place_id, ad_id } = req.body;
    models.update_request.create({
        resquest_data: request_data,
        status: 'sent',
        officer: officer,
        ad_place_id: ad_place_id,
        ad_id: ad_id
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

controller.getAmountOfDistrictByStatus = async (isResolved = false) => {
    try {
        let selectQuery = `
        SELECT total."name", total."areaId", COUNT(*) AS "amount"
        FROM (
            SELECT ur.id, a.parent_id as "areaId", a2.name, ur.status
            FROM update_requests ur
            JOIN ad_places ap ON ap.id = ur.ad_place_id
            JOIN places p ON ap.place_id = p.id
            JOIN areas a ON a.id = p.area_id 
            JOIN areas a2 ON a2.id = a.parent_id
            UNION
            SELECT ur.id, a.parent_id as "areaId", a2.name, ur.status
            FROM update_requests ur
            JOIN ad_contents ac ON ac.id = ur.ad_id
            JOIN ad_places ap ON ap.id = ac.ad_place_id
            JOIN places p ON ap.place_id = p.id
            JOIN areas a ON a.id = p.area_id
            JOIN areas a2 ON a2.id = a.parent_id
        ) AS "total"
        `;
    
        if (isResolved) {
            selectQuery = selectQuery + `WHERE total.status <> 'sent'`;
        } else {
            selectQuery = selectQuery + `WHERE total.status = 'sent'`;
        }

        // Add the group clause
        selectQuery = selectQuery + ` GROUP BY total."areaId", total."name" ORDER BY "total"."areaId" DESC;`;
    
        let data = await models.sequelize.query(selectQuery);
    
        return {
            success: true,
            data: data[0]
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message
        };
    }
}

controller.getUpdateAmount = async (req, res) => {
    let isResolved = req.query.isResolved;
    if (isResolved === undefined) { isResolved = false}
    let data = await controller.getAmountOfDistrictByStatus(isResolved);
    res.json(data);
}

controller.getUpdateReqListByArea = async (areaId, isResolved = false) => {
    try {
        let query = `
        select *
        from (
        select ur.id, ur."createdAt", acc.first_name, acc.last_name, p.area_id, a.parent_id, a."name", ur.status, p.address_formated, 'ad_place' as "type"
        from update_requests ur 
            join ad_places ap on ur.ad_place_id = ap.id 
            join places p on p.id = ap.place_id 
            join areas a on a.id = p.area_id 
            join accounts acc on acc.id = ur.officer 
        union 
        select ur.id, ur."createdAt", acc.first_name, acc.last_name, p.area_id, a.parent_id, a."name", ur.status, p.address_formated, 'ad_content' as "type"
        from update_requests ur 
            join ad_contents ac on ac.id = ur.ad_id 
            join ad_places ap on ac.ad_place_id = ap.id 
            join places p on p.id = ap.place_id 
            join areas a on a.id = p.area_id 
            join accounts acc on acc.id = ur.officer 
        ) as "reqList"
        where "reqList"."parent_id" = $areaId
        `
        if (isResolved) {
            query = query + `and "reqList".status <> 'sent'`
        } else {
            query = query + `and "reqList".status = 'sent'`
        }

        query = query + `order by "reqList"."parent_id" desc;`

        let data = await models.sequelize.query(query, { bind: { areaId: areaId }, type: models.sequelize.QueryTypes.SELECT });
        return {
            success: true,
            data: data
        }
    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}

controller.getUpdateReqList = async (req, res) => {
    let {areaId, isResolved} = req.query;
    if (!areaId) {
        res.json({
            success: false,
            message: "Missing areaId"
        })
    }
    if (!isResolved) {isResolved = false};
    let data = await controller.getUpdateReqListByArea(areaId, isResolved);
    res.json(data);
}

async function getOneAdPlace(id, includeAdContent = false) {
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
                        { model: models.area, attributes: ['id', 'name', 'formatedName', 'parent_id'] }
                    ]
                }
            ],
            where: {
                id: id
            },
        });
        data.dataValues.place.geometry = JSON.parse(data.dataValues.place.geometry);
        if (includeAdContent) {
            try {
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
async function getOneAdContent(id) {
    try {
        let data = await models.ad_content.findOne({
            attributes: ['id', 'company_name', 'width', 'height', 'start', 'end', 'image1', 'image2'],
            include: [
                { model: models.category, attributes: ['name'] },
                {
                    model: models.ad_place, attributes: ['id', 'purpose', 'location_type'], include: [
                        { model: models.place, attributes: ['address_formated'], include: [{ model: models.area, attributes: ['formatedName'] }] }]
                },
            ],
            where: { id: id },
        })
        if (data) {
            let purposeId = data.dataValues.ad_place.purpose;
            let locationId = data.dataValues.ad_place.location_type;

            console.log(purposeId);
            let purposeData = await models.category.findOne({
                attributes: ['name'],
                where: { id: purposeId }
            })
            let locationData = await models.category.findOne({
                attributes: ['name'],
                where: { id: locationId }
            })
            console.log(purposeData)
            data.purpose = purposeData.dataValues.name;
            data.location = locationData.dataValues.name;
            return data;
        }
        else {
            return null
        }
    } catch (err) {
        return err
    }

}
controller.getUpdateRequest = async (req, res) => {
    let upReqId = req.query.updateRequestId;
    let optionReq = {
        attributes: ['id', 'resquest_data', 'status', 'ad_id', 'ad_place_id', 'createdAt', 'officer'],
        where: {
            id: upReqId
        }
    }
    let request = await models.update_request.findOne(optionReq)
    request.resquest_data = JSON.parse(request.resquest_data)
    let adPlace = null
    let adContent = null;
    let data = {}

    data.reason = request.resquest_data.reasonUpdate

    if (request.ad_id) {
        console.log("Ad content")
        adContent = await getOneAdContent(request.ad_id)

        let img = []

        if (adContent.image1 != null) {
            img.push(adContent.image1);
        }


        if (adContent.image2 != null) {
            img.push(adContent.image2);
        }
        data.type = 'ad_content'
        data.before = {
            height: adContent.height,
            width: adContent.width,
            start: adContent.start,
            end: adContent.end,
            image: img
        }

        data.after = {
            height: request.resquest_data.height,
            width: request.resquest_data.width,
            start: request.resquest_data.start,
            end: request.resquest_data.end,
            image: request.resquest_data.image
        }

        data.purpose = adContent.purpose;
        data.location = adContent.location;
        data.address = adContent.ad_place.place.address_formated + ', ' + adContent.ad_place.place.area.formatedName;

    } else {
        console.log("Ad place")
        adPlace = await getOneAdPlace(request.ad_place_id, false)

        let img = []

        if (adPlace.image1 != null) {
            img.push(adPlace.image1);
        }


        if (adPlace.image2 != null) {
            img.push(adPlace.image2);
        }

        data.type = 'ad_place'
        data.before = {
            capacity: adPlace.capacity,
            locationType: adPlace.location_type,
            purposeType: adPlace.purpose,
            status: adPlace.status,
            image: img
        }

        data.after = {
            capacity: parseInt(request.resquest_data.capacity),
            locationType: request.resquest_data.locationType,
            purposeType: request.resquest_data.purposeType,
            status: request.resquest_data.status,
            image: request.resquest_data.image
        }

        data.address = adPlace.place.address_formated + ', ' + adPlace.place.area.formatedName;
        data.purpose = adPlace.purpose;
        data.location = adPlace.location;

    }
    data.id = request.id
    data.createdAt = request.createdAt;
    data.officer = await models.account.findOne({
        attributes: ['first_name', 'last_name'],
        where: {
            id: request.officer
        }
    })



    res.json({
        request: data
    })
}

module.exports = controller;