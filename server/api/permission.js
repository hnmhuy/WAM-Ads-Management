'use strict'

const controller = {}
const models = require('../models');
const category = require('../api/category')

controller.getRequest = async (req, res, next)=>{
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