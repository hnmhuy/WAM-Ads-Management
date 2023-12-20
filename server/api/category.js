const controller = {};
const models = require('../models')

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
            attributes: ['id', 'name', 'description', 'createdAt'],
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