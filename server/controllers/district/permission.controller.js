const controller = {}
const models = require('../../models');

const { QueryTypes }=require('sequelize');

controller.createRequest = async(req, res, next)=>{
    console.log(req.body);
    let img = req.files;
    let {ad, size, adTypeId, adType, address, addressOfAd, contact, content, email, endDate, idAddressOfAd, inputName, startDate} = req.body;
    //create ad_content
    let height = size[0];
    let width = size[1];
    let ad_content;
    let request;
    try {
        ad_content = await models.ad_content.create({
            company_name: inputName,
            description: content,
            height,
            width,
            start: startDate,
            end: endDate,
            image1: img[0] ? img[0].path : null,
            image2: img[1] ? img[0].path : null,
            ad_place_id: idAddressOfAd,
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
            address: ad,
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
        'SELECT create_requests.officer, create_requests.status, ad_contents.*, places.address_formated, categories.name, categories.field_id FROM create_requests JOIN ad_contents ON ad_contents.id = create_requests.ad_id JOIN ad_places ON ad_places.id = ad_contents.ad_place_id JOIN places ON places.id = ad_places.place_id JOIN categories ON ad_contents.ad_type = categories.id WHERE create_requests.officer = $1',
        { 
            bind: [req.session.user.id], 
            type: models.Sequelize.QueryTypes.SELECT 
        }
    );
    

    console.log(data);
    res.render('district/permission', { layout: 'district_layout', data: data});
}

module.exports = controller; 