const controller = {}
const e = require('express');
const city_adminstrative = require('../area.db.json');
const models = require('../models');

function getAllAreaFromJSON(level, idDistrict = null) {
    let res = null;
    if (level == 1) {
        res = city_adminstrative.district.filter(item => item.idProvince === '79');
        return {
            status: "success",
            data: res
        }
    } else if (level == 2) {
        if (idDistrict) {
            res = city_adminstrative.commune.filter(item => item.idDistrict === idDistrict);
            return {
                status: "success",
                data: res
            }
        } else return {
            status: "error",
            message: "Invalid query - idDistrict is required"
        };
    } else return {
        status: "error",
        message: "Invalid query - level is invalid"
    }
}

async function getAllAreaFromDB(level, idDistrict = null) {
    let res = null;
    if (level == 1) {
        res = await models.area.findAll({
            where: {
                parent_id: null
            }
        })

        return {
            status: "success",
            data: res
        }
    } else if (level == 2) {
        if (idDistrict) {
            res = await models.area.findAll({
                where: {
                    parent_id: idDistrict
                }
            })
            return {
                status: "success",
                data: res
            }
        } else return {
            status: "error",
            message: "Invalid query - idDistrict is required"
        };
    } else return {
        status: "error",
        message: "Invalid query - level is invalid"
    }
}


async function getUncreatedArea(level, idDistrict = null) {
    if (level == 1) {
        let district = city_adminstrative.district.filter(item => item.idProvince === '79');
        let existed = await models.area.findAll({
            where: {
                parent_id: null
            }
        });
        let uncreated = district.filter(item => !existed.find(e => e.id === item.idDistrict));
        return {
            status: "success",
            data: uncreated
        };
    } else if (level == 2) {
        if (idDistrict) {
            let commune = city_adminstrative.commune.filter(item => item.idDistrict === idDistrict);
            let existed = await models.area.findAll({
                where: {
                    parent_id: idDistrict
                }
            })
            let uncreated = commune.filter(item => !existed.find(e => e.id === item.idCommune));
            return {
                status: "success",
                data: uncreated
            };
        } else return {
            status: "error",
            message: "Invalid query - idDistrict is required"
        };
    } else return {
        status: "error",
        message: "Invalid query - level is invalid"
    }
}

async function getAreaAHierarchy() {
    let res = [];
    let district = await models.area.findAll({
        where: {
            parent_id: null
        }
    });
    for(let i=0; i<district.length; i++){
        let officer = await models.account.findAll({
            attributes: ['first_name', 'last_name'],
            where: {
                delegation: district[i].id  
            }
        })
        district[i].dataValues.officer = officer ? officer : [];
        let commune = await models.area.findAll({
            where: {
                parent_id: district[i].id
            }
        });
        for(let j=0; j<commune.length; j++){
            let officer = await models.account.findAll({
                attributes: ['first_name', 'last_name'],
                where: {
                    delegation: commune[j].id  
                }
            })
            commune[j].dataValues.officer = officer ? officer : [];
        }
        res.push({
            district: district[i],
            commune: commune
        })
    }
    return res;
}

controller.getArea = async (req, res) => {
    // Structure query
    // opts: all - get all from area.db.json; db - get from database; 
    // uncreated - remove existed area in db (require remove level)
    // level: 1 or 2
    // idDistrict: id of district
    
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    let { opts, level, idDistrict } = req.query;
    let data = [];
    if (opts === 'all') {
        data = getAllAreaFromJSON(level, idDistrict);
    } else if (opts === 'db') {
        data = await getAllAreaFromDB(level, idDistrict);
    } else if (opts === 'uncreated') {
        data = await getUncreatedArea(level, idDistrict);
    } else if (opts === 'hierarchy') {
        data = await getAreaAHierarchy();
    } else {
        data = {
            status: "error",
            message: "Invalid query"
        }
    }
    res.json(data);
}

controller.createArea = async (req, res) => {
    let { id, name, parent_id } = req.body;
    models.area.create({
        id: id,
        name: name,
        parent_id: parent_id
    }).then(data => {
        res.json({
            status: "success",
            data: data
        })
    }).catch(err => {
        res.json({
            status: "error",
            message: err.message
        })
    })
}

module.exports = controller; ``