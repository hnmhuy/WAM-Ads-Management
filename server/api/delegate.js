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

async function updateAccountDelegation(uid, areaId, res) {
    await models.area.findOne({
        attributes: ['id', 'parent_id'],
        where: {id: areaId}
    }).then(data => {
        if(data.length === 0) {
            res.status(400).json({
                status:"error",
                message:"Area not found"
            })
        }
        let areaLevel = data.parent_id === null ? 1 : 2;
        models.account.update({
            areaLevel: areaLevel,
            delegation: areaId
        }, {
            where: {id: uid}
        }).then(data => {
            res.json({
                status:"success",
                message:"Update officer success"
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                status:"error",
                message:"Internal server error"
            })
        
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            status:"error",
            message:"Internal server error"
        })
    })
} 

async function updateAccountStatus(uid, status, res) {
    await models.account.update(
        {status: status},
        {where: {id: uid}}
    ).then(data => {
        res.json({
            message: "success",
            data: data
        })
    }).catch(err => {
        res.json({
            message: "error",
            data: err.errors
        })
    })
}

controller.updateOfficer = async (req, res) => {
    console.log (req.body);
    const {uid, opt, areaId, status} = req.body;
    if(opt === 'area') {
        await updateAccountDelegation(uid, areaId, res);
    } else if (opt ==='status') {
        await updateAccountStatus(uid, status, res);
    } else {
        res.status(400).json({
            status:"error",
            message:"Invalid option"
        })
    }
}

module.exports = controller