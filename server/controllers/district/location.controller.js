const controller = {}
const models = require('../../models');
const splitAddressFormatted = (address_formatted) => {
    let address_part = {
        street: '',
        ward: '',
        district: ''
    }


    const addressParts = address_formatted.split(', ')
    address_part.street = addressParts[0];
    address_part.ward = addressParts[1];
    address_part.district = addressParts[2];
    return address_part
}
controller.show = async (req, res) => {
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Danh sách điểm quảng cáo"
    let delegation = req.session.user.delegation

    let data_row = await models.ad_place.findAll({
        attributes: ['id', 'capacity', 'status', 'image1', 'image2'],
        include: [
            {
                model: models.place,
                as: "place",
                attributes: ['address_formated'],
                include: {
                    model: models.area,
                    as: 'area',
                    attributes: ['formatedName']
                },
                where: {
                    area_id: delegation
                }
            },
            {
                model: models.category,
                as: 'locationType',
                attributes: ['name'],
            },
            {
                model: models.category,
                as: 'purposeType',
                attributes: ['name'],
            }
        ]
    }).then((data) => {
        let data_row = []
        data.forEach((item) => {
            let tmp = {}
            tmp.id = item.id
            tmp.capacity = item.capacity;
            tmp.type_ad = item.locationType.name;
            tmp.purpose_ad = item.purposeType.name;
            tmp.image1 = item.image1;
            tmp.image2 = item.image2;
            if (item.status == 1) {
                tmp.status = {
                    "status_id": "delivered",
                    "status_name": "Đã quy hoạch"
                }
            }
            else {
                tmp.status = {
                    "status_id": "cancelled",
                    "status_name": "Chưa quy hoạch"
                }
            }

            let ward_district = item.place.area.formatedName.split(', ');

            tmp.address = {
                "street": item.place.address_formated,
                "ward": ward_district[0],
                "district": ward_district[1]
            }
            data_row.push(tmp)
        })

        return data_row;
    })
    res.locals.data_rows = data_row
    res.render('district/location', { layout: 'district_layout' });
}


module.exports = controller