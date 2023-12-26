const controller = {}
const models = require('../models');

const {Op, literal} = models.Sequelize

// Can get all officers, or get officers by arealevel or by area

async function getAllOfficers() {
    try {
        let data = await models.account.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'createdAt', 'areaLevel', 'status'],
            where:{
                areaLevel: {[models.Sequelize.Op.not]: 0}
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    model: models.area,
                    attributes: ['id', 'name', 'parent_id', 'formatedName']
                }
            ]
        })
        return {
            status:"success",
            data:data
        }
    } catch (err) {
        return {
            status:"error",
            message:err
        }
    }
}

async function getOfficersByArea(areaId, includeChild = false) {
    if (includeChild) {
        try {
            let data = await models.account.findAll({
                attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'createdAt', 'areaLevel', 'status'],
                include: [
                    {
                        model: models.area,
                        attributes: ['id', 'name', 'parent_id', 'formatedName']
                    }
                ],
                where: {
                    areaLevel: {[Op.not]: 0},
                    [Op.or]: [
                        {delegation: areaId},
                        literal(`area.parent_id = '${areaId}'`)
                    ]
                },
            })
            return {
                status:"success",
                data:data
            }
        } catch (err) {
            return {
                status:"error",
                message:err
            }
        }
    }
    try {
        let data = await models.account.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'createdAt', 'areaLevel', 'status'],
            where:{
                areaLevel: {[models.Sequelize.Op.not]: 0},
                delegation: areaId
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    model: models.area,
                    attributes: ['id', 'name', 'parent_id', 'formatedName']
                }
            ]
        })
        return {
            status:"success",
            data:data
        }
    } catch (err) {
        return {
            status:"error",
            message:err
        }
    }
}


controller.getOfficer = async (req, res) => {
    let areaId = req.query.areaId
    let includeChild = req.query.includeChild
    includeChild = includeChild === 'true' ? true : false
    if (areaId) {
        res.json(await getOfficersByArea(areaId, includeChild));
    } else {
        res.json(await getAllOfficers());
    }
}

module.exports = controller