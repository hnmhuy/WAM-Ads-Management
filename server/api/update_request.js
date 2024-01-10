'use strict'

const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const controller = {}

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

module.exports = controller;