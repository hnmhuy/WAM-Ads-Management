'use strict'

const controller = {}
const models = require('../models');
const category = require('../api/category')
const sequelize = require('sequelize')

controller.getPermission = async (req, res, next)=>{
    console.log(req.query);
    const {id, area} = req.query;
    let permissionList = await getPermission(id, area);
    console.log(permissionList)
    if(permissionList.success){
        res.json({
            success: true,
            message: "Lấy danh sách thành công",
            data: permissionList.data
        })
    } else {
        res.json({
            success: false,
            message: "Lấy danh sách thất bại",
            data: null
        })
    }
}

async function getPermission(id, area){
    try {
        console.log(area);
        let data = await models.sequelize.query(
            'SELECT create_requests.id as request_id, create_requests.officer, create_requests.status, ad_contents.*, places.address_formated, categories.name, categories.field_id FROM create_requests JOIN ad_contents ON ad_contents.id = create_requests.ad_id JOIN ad_places ON ad_places.id = ad_contents.ad_place_id JOIN places ON places.id = ad_places.place_id JOIN categories ON ad_contents.ad_type = categories.id WHERE create_requests.officer = :id AND places.area_id = :area',
            { 
                replacements: {
                    id,
                    area 
                }, // Replace :id and :area_id with actual values
                type: sequelize.QueryTypes.SELECT
            }
        );
        return {
            success: true,
            message: "Lấy danh sách cấp phép thành công",
            data: data,
        }
    } catch (error) {
        return {
            success: false,
            message: error,
            data: null
        }
    }
}

// controller.add = async (data) => {
//     try {
//         let place = await models.place.create({
//             geometry: data.geometry,
//             address_formated: data.address_formated,
//             area_id: data.area_id
//         })
//         return place.dataValues;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

// controller.createAdContent = async (req, res) => {
//     const data = {};
//     let placeRes = await controller.addPlace(data);
//     if (placeRes) {
//         res.json({
//             success: true,
//             message: "Create place success",
//             data: res
//         })
//     } else {
//         res.json({
//             success: false,
//             message: "Create place fail",
//             data: null
//         })
//     }
// }

// export the createPlace function
module.exports = controller;