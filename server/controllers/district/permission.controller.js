const controller = {}
const models = require('../../models');

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

    let data = await models.create_request.findAll({
        attributes: [
            "id",
            "status",
            "officer",
            "ad_id"
        ],
        include: [{
            model: models.ad_content, 
            attributes: [
                "id",
                "company_name",
                "width",
                "height",
                "description",
                "start",
                "end",
                "image1",
                "image2",
                "ad_place_id",
                "ad_type"
            ],
            include: [{
                model: models.ad_place,
                include: [{
                    model: models.place,
                    attributes: [
                        "address_formated"
                    ]
                }]
            }, {
                model: models.category,
                attributes: [
                    "name"
                ]
            }]
        }],
        where: {officer: req.session.user.id},
    })
    console.log(data.name);
    res.render('district/permission', { layout: 'district_layout'});
}

module.exports = controller; 