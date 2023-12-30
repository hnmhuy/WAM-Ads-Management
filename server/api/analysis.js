const controller = {};
const models = require("../models");
const { Op } = require('sequelize');
const {sequelize} = require("../models")



async function getQuantityFeedback(mode, date)
{
    let queryString = [];
    if(mode === "month")
    {
        queryString[0] = `TIMESTAMP '${date}-01 00:00:00+00'::timestamp with time zone`;
        queryString[1] = `TIMESTAMP '${date}-01 00:00:00+00'::timestamp with time zone + INTERVAL '1 month'`
                                           
    }
    else if (mode === "date")
    {
        queryString[0] = `TIMESTAMP '${date} 00:00:00+00'::timestamp with time zone`;
        queryString[1] = `TIMESTAMP '${date} 23:59:59+00'::timestamp with time zone`
    }
    else if (mode === "period")
    {
        date = date.split("to");
        queryString[0] = `TIMESTAMP '${date[0]} 00:00:00+00'::timestamp with time zone`;
        queryString[1] = `TIMESTAMP '${date[1]} 23:59:59+00'::timestamp with time zone`
    }
    try
        {
        const count = await models.feedback.count({
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal(`${queryString[0]}`),
                    [Op.lt]: sequelize.literal(`${queryString[1]}`)
                }
            }
         });
         return {count: count};
        } catch (err)
        {
            console.log("EMPTY: " ,err);
            return {count: 0};
            
        }  
}

async function getQuantityRequest (mode, date, areaID)
{
    let queryString = [];
    if(mode === "month")
    {
        queryString[0] = `TIMESTAMP '${date}-01 00:00:00+00'::timestamp with time zone`;
        queryString[1] = `TIMESTAMP '${date}-01 00:00:00+00'::timestamp with time zone + INTERVAL '1 month'`
        if (areaID === "all")
        {
            try
            {
            const count = await models.create_request.count({
                where: {
                    createdAt: {
                        [Op.gte]: sequelize.literal(`${queryString[0]}`),
                        [Op.lt]: sequelize.literal(`${queryString[1]}`)
                    }
                }
            });
            return {count: count};
            } catch (err)
            {
                console.log("EMPTY: " ,err);
                return {count: 0};
            }
        }
        else
        {
            try {
                const counts = await models.create_request.findAll({
                    attributes: [
                        'areaID', // Group by areaID
                        [sequelize.fn('COUNT', sequelize.col('areaID')), 'count'] // Count records for each areaID
                    ],
                    where: {
                        createdAt: {
                            [Op.gte]: sequelize.literal(`${queryString[0]}`),
                            [Op.lt]: sequelize.literal(`${queryString[1]}`)
                        },
                        areaID: areaIDs
                    },
                    group: ['areaID'] // Group by areaID
                });
    
                return counts.map(count => ({ areaID: count.areaID, count: count.get('count') }));
            } catch (err) {
                console.error("Error counting requests:", err);
                return [];
            }
        }
    }
}


controller.getQuantity = async (req, res) =>
{
    let {type, mode, areaId, date} = req.query;
    console.log(type, mode);
    let data;
    
    try {
        if(type === "feedback")
        {
            data = await getQuantityFeedback(mode, date);
        }
        else if (type === "request")
        {
            data = await getQuantityRequest(mode, date, areaId);
        }
        else if (type === "adPlace")
        {
            data = await getQuantityAd(mode, date);
        }
        res.json(data);

    } catch (err) {
        res.json({ error: err.message });
    }
}




module.exports = controller;