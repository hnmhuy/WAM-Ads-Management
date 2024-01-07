const controller = {}
const models = require('../../models');
const fs = require("fs")

const { QueryTypes }=require('sequelize');
const ad_content = require('../../models/ad_content');
const path = require('path');

controller.deleteRequest = async(req, res)=>{
    console.log(req.body);
    try {
        const ad_content = req.body['ad-content']
        if(req.body['image1']){
            const image1 = req.body['image1'];
            fs.unlinkSync( __dirname + '../../../'  + image1);
        }
        if(req.body['image2']){
            const image2 = req.body['image2'];
            fs.unlinkSync(  __dirname + '../../../' + image2);
        }
        await models.ad_content.destroy({where: {id: ad_content}});
        try {
            const request_id = req.body['request-id'];
            await models.create_request.destroy({where: {id: request_id}});
            res.json({
                success: true,
                message: "Xoá thành công",
                id: request_id
            })
        } catch (error) {
            
        }
    } catch (error) {
        throw error;
    }
}

controller.createRequest = async(req, res, next)=>{
    console.log(req.body);
    let img = req.files;
    let {inputName, size, startDate, email, address, endDate, adType, adTypeId, content, locationId} = req.body;
    let adLocation = req.body['ad-location'];
    // let {ad, size, adTypeId, adType, address, addressOfAd, contact, content, email, endDate, idAddressOfAd, inputName, startDate} = req.body;
    // let adLocation = req.body['ad-location'];
    //create ad_content
    let height = size[0];
    let width = size[1];
    let ad_content;
    let request;
    try {
        ad_content = await models.ad_content.create({
            company_name: inputName,
            company_email: email,
            company_address: address,
            description: content,
            height,
            width,
            start: startDate,
            end: endDate,
            image1: img[0] ? img[0].path : null,
            image2: img[1] ? img[0].path : null,
            ad_place_id: locationId,
            ad_type: adTypeId,
        });

        try{
            request = await models.create_request.create({
                officer: req.session.user.id,
                ad_id: ad_content.id,
                status: "sent",
            })
        } catch (error) {
            throw error;
        }

        res.json({
            message: "Success",
            request: request,
            ad_content: ad_content,
            address: adLocation,
            type: adType,
        })
    } catch (error) {
        throw error;
    }
}

controller.show = async (req, res) => {
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Danh sách cấp phép"

    let data = await models.sequelize.query(
        'SELECT create_requests.id as request_id, create_requests.officer, create_requests.status, ad_contents.*, places.address_formated, categories.name, categories.field_id FROM create_requests JOIN ad_contents ON ad_contents.id = create_requests.ad_id JOIN ad_places ON ad_places.id = ad_contents.ad_place_id JOIN places ON places.id = ad_places.place_id JOIN categories ON ad_contents.ad_type = categories.id WHERE create_requests.officer = $1',
        { 
            bind: [req.session.user.id], 
            type: models.Sequelize.QueryTypes.SELECT 
        }
    );
    

    console.log(data);
    res.render('district/permission', { layout: 'district_layout', data: data});
}

module.exports = controller; 