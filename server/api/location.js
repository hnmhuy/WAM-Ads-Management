'use strict'

const controller = {}
const models = require('../models');



controller.createTypeAndPurpose = async (req, res) => {
    // Type id
    let data_type_id = [
        {
            name: "Đất công/ Công viên/Hành lang an toàn giao thông",
            description: "Đất công/ Công viên/Hành lang an toàn giao thông",
        },
        {
            name: "Đất tư nhân/Nhà ở riêng lẻ",
            description: "Đất tư nhân/Nhà ở riêng lẻ",
        },
        {
            name: "Trung tâm thương mại",
            description: "Trung tâm thương mại",
        },
        {
            name: "Chợ",
            description: "Chợ",
        },
        {
            name: "Nhà chờ xe buýt",
            description: "Nhà chờ xe buýt",
        },
        {
            name: "Cây xăng",
            description: "Cây xăng",
        }
    ];

    let field_type_id = await models.field.findOne({
        attribute: ['id'],
        where: {
            name: "Vị trí"
        }
    }).then(result => result.id);

    for (let i = 0; i < data_type_id.length; i++) {
        data_type_id[i].field_id = field_type_id;
        await models.category.create(data_type_id[i]);
    }

    // Purpose Id

    let data_purpose_id = [
        {
            name: "Cổ động chính trị",
            description: "Cổ động chính trị",
        },
        {
            name: "Quảng cáo thương mại",
            description: "Quảng cáo thương mại",
        },
        {
            name: "Xã hội hóa",
            description: "Xã hội hóa",
        }
    ];

    let field_purpose_id = await models.field.findOne({
        attribute: ['id'],
        where: {
            name: "Loại QC"
        }
    }).then(result => result.id);

    for (let i = 0; i < data_purpose_id.length; i++) {
        data_purpose_id[i].field_id = field_purpose_id;
        await models.category.create(data_purpose_id[i]);
    }

    res.json({
        message: "Create Successfully"
    });
};

controller.getLocations = (req, res) => {
    models.ad_place.findAll({
        attributes: ['id', 'capacity', 'status'],
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
            if (item.status === 1) {
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

        res.json({
            data_row: data_row
        })
    })
}

module.exports = controller;