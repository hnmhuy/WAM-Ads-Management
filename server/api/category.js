const controller = {};
const models = require('../models')

controller.restoreField = async (req, res) => {
    let data = [
        {
            name: "Vị trí",
            description: "Mô tả ngắn gọn vị trí điểm đặt quảng cáo"
        },
        {
            name: "Mục đích",
            description: "Chủ đề chung của các bảng quảng cáo"
        },
        {
            name: "Loại QC",
            description: "Loại bảng quảng cáo được lắp đặt"
        },
        {
            name: "Phản ánh",
            description: "Phân loại phản ánh từ người dân"
        }
    ]

    for(let i = 0; i < data.length; i++) {
        await models.field.create(data[i]);
    }

    res.redirect("/api/location/createTypeAndPurpose");
}

controller.getField = (req, res) => {
    models.field.findAll({
        attributes: ['id', 'name', 'description'],
    })
    .then((data) => {
        res.json(
            {
                length: data.length,
                data: data
            }
        );
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}

controller.getCategory = (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let fieldId = req.query.fieldId;
    if(!fieldId) {
        // Query all category   
        models.category.findAll({
            attributes: ['id', 'name', 'description', 'field_id', 'createdAt']
        }).then((data) => {
            if(data.length === 0) { 
                res.status(404).json({
                    message: "Not found any category",
                });
            } else res.json(
                {
                    length: data.length,
                    data: data
                }
            );
        }).catch((err) => {
            res.status(500).json({
                message: err.message,
            });
            console.log(err);
        })
    } else {
        models.category.findAll({
            attributes: ['id', 'name', 'description', 'createdAt', 'field_id'],
            where: {
                field_id: fieldId
            }
        }).then((data) => {
            res.json(
                {
                    length: data.length,
                    data: data
                }
            );
        }).catch((err) => {
            res.status(500).json({
                message: err.message,
            });
            console.log(err);
        })
    }
}

controller.createCategory = (req, res) => {
    let {name, description, field_id} = req.body;
    models.category.create({
        name: name,
        description: description,
        field_id: field_id   
    }).then((data) => {
        res.json({
            message: "Create category successfully",
            data: data
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message,
        });
        console.log(err);
    })
}

controller.updateCategory = (req, res) => {
    let {id, name, description} = req.body;
    models.category.update({
        name: name,
        description: description,
    }, {
        where: {
            id: id
        } 
    }).then((data) => {
        res.json({
            message: "Update category successfully",
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