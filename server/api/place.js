const controller = {}
const models = require('../models');
const sequelize = require('sequelize')

controller.addPlace = async (data) => {
    try {
        let place = await models.place.create({
            geometry: data.geometry,
            address_formated: data.address_formated,
            area_id: data.area_id
        })
        return place.dataValues;
    } catch (error) {
        console.log(error);
        return null;
    }
}

controller.createPlace = async (req, res) => {
    const data = {};
    data.geometry = req.body.geometry;
    data.address_formated = req.body.street;
    data.area_id = req.body['ward'];
    let placeRes = await controller.addPlace(data);
    if (placeRes) {
        res.json({
            success: true,
            message: "Create place success",
            data: res
        })
    } else {
        res.json({
            success: false,
            message: "Create place fail",
            data: null
        })
    }
}

controller.updatePlace = async (data) => {
    try {
        let res = await models.place.update({
            geometry: data.geometry,
            address_formated: data.address_formated,
            area_id: data.area_id
        }, {
            where: {
                id: data.id
            }
        })
        return res;
    } catch(error) {
        console.log(error);
        return null;
    }
} 

controller.getFeedback = async(req, res)=>{
    let {place_id} = req.query;
    let feedback = await models.sequelize.query('SELECT * FROM feedbacks WHERE feedbacks.place_id = $1',
        { 
            bind: [place_id], 
            type: models.Sequelize.QueryTypes.SELECT 
        }
    );
    res.json(feedback);
}

controller.getAdContent = async(req, res)=>{
    let {place_id} = req.query;
    let ad_content = await models.sequelize.query('SELECT * FROM ad_contents WHERE ad_contents.place_id = $1',
        { 
            bind: [place_id], 
            type: models.Sequelize.QueryTypes.SELECT 
        }
    );
    res.json(ad_content);
}

// export the createPlace function
module.exports = controller;