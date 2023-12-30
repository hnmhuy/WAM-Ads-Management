const controller = {} 
const models = require('../models');  
const { addPlace } = require('./place');  

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
    console.log(req.body);  
    console.log(req.files);
    // Create a place
    const placeData = {};
    placeData.geometry = req.body.geometry;
    placeData.address_formated = req.body.street;
    placeData.area_id = req.body['ward'];
    let placeRes = await addPlace(placeData);
    if(placeRes) {
        const data = {};
        data.capacity = req.body['ads-amount'];
        data.image1 = null;
        data.image2 = null;
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

module.exports = controller;