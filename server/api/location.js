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
            name: "Mục đích"
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

controller.createTypeAdContent = async (req, res) => {
    let data = [
        {
            name: "Trụ bảng hiflex",
            description: "Trụ bảng hiflex",
        },
        {
            name: "Trụ màn hình điện tử LED",
            description: "Trụ màn hình điện tử LED"
        },
        {
            name: "Trụ hộp đèn",
            description: "Trụ hộp đèn"
        },
        {
            name: "Bảng hiflex ốp tường",
            description: "Bảng hiflex ốp tường"
        },
        {
            name: "Trụ treo băng rôn dọc",
            description: "Trụ treo băng rôn ngang"
        },
        {
            name: "Trụ/Cụm pano",
            description: "Trụ/Cụm pano"
        },
        {
            name: "Cổng chào",
            description: "Cổng chào"
        },
        {
            name: "Trung tâm thương mại",
            description: "Trung tâm thương mại"
        },
    ]

    let type_id = await models.field.findOne({
        attribute: ['id'],
        where: {
            name: "Loại QC"
        }
    }).then(result => result.id);

    for (let i = 0; i < data.length; i++) {
        data[i].field_id = type_id;
        await models.category.create(data[i]);
    }

    res.json({
        message: "Create Successfully"
    });
}

controller.createFeedbackCategory = async (req, res) => {
    let data = [
        {
            name: "Tố giác sai phạm",
            description: "Tố giác sai phạm"
        },
        {
            name: "Đóng góp ý kiến",
            description: "Đóng góp ý kiến"
        },
        {
            name: "Giải đáp thắc mắc",
            description: "Giải đáp thắc mắc"
        },
        {
            name: "Đăng ký nội dung",
            description: "Đăng ký nội dung"
        }
    ]

    let type_id = await models.field.findOne({
        attribute: ['id'],
        where: {
            name: "Phản ánh"
        }
    }).then(result => result.id);

    for (let i = 0; i < data.length; i++) {
        data[i].field_id = type_id;
        await models.category.create(data[i]);
    }

    res.json({
        message: "Create Successfully"
    });
}
controller.getLocations = (req, res) => {
    let delegation = req.query.delegation;
    models.ad_place.findAll({
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
        res.json({
            data_row: data_row
        })
    })
}

controller.getLocationById = (req, res) => {
    let ad_place_id = req.query.ad_place_id;
    models.ad_place.findAll({
        attributes: ['id', 'capacity', 'status', 'image1', 'image2'],
        include: [
            {
                model: models.place,
                as: "place",
                attributes: ['address_formated'],
                include: [
                    {
                        model: models.area,
                        as: 'area',
                        attributes: ['formatedName']
                    }
                ]
            },
            {
                model: models.category,
                as: 'TypeAds',
                attributes: ['id', 'name'],
            },
            {
                model: models.category,
                as: 'PurposeAds',
                attributes: ['id', 'name'],
            }
        ],
        where: {
            id: ad_place_id
        }
    }).then((data) => {
        res.json({
            message: "Update successfully",
            data: data
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}

controller.getAds = (req, res) => {
    let ad_place_id = req.query.ad_place_id;
    models.ad_content.findAll({
        attributes: ['id', 'company_name', 'width', 'height', 'start', 'end', 'image1', 'image2'],
        where: {
            ad_place_id: ad_place_id
        }
    }).then((data) => {
        res.json({
            message: "Update successfully",
            data: data
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}
module.exports = controller;