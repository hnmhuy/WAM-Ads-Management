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


    let data_row = await models.ad_place.findAll({
        attributes: ['id', 'capacity', 'status', 'image1', 'image2'],
        include: [
            {
                model: models.place,
                as: "place",
                attributes: ['address_formated']
            },
            {
                model: models.category,
                as: 'TypeAds',
                attributes: ['name'],
            },
            {
                model: models.category,
                as: 'PurposeAds',
                attributes: ['name'],
            }
        ]
    }).then((data) => {
        let data_row = []
        data.forEach((item) => {
            let tmp = {};
            tmp.id = item.id
            tmp.capacity = item.capacity;
            tmp.type_ad = item.TypeAds.name;
            tmp.purpose_ad = item.PurposeAds.name;
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
            tmp.address = splitAddressFormatted(item.place.address_formated)
            data_row.push(tmp)
        })

        return data_row;
    })
    res.locals.data_rows = data_row
    res.render('district/location', { layout: 'district_layout' });
}


module.exports = controller