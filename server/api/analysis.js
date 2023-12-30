const controller = {};
const models = require("../models");
const { Op } = require('sequelize');
const {sequelize} = require("../models")


function generateLastMonth(date)
{
    const [year, month] = date.split('-').map(Number);
    let previousMonth = month === 1 ? `${year - 1}-12` : `${year}-${month - 1}`;
    return previousMonth;
}

async function getQuantityPerMonth(type, date)
{
    let queryString = [];
    let table ;
    if (type === "feedback")
    {
        table = models.feedback;
    }
    else if (type === "request")
    {
        table = models.create_request;
    }else if (type === "adPlace")
    {
        table = models.ad_content;
    }
    queryString[0] = `TIMESTAMP '${date}-01 00:00:00+00'::timestamp with time zone`;
    queryString[1] = `TIMESTAMP '${date}-01 00:00:00+00'::timestamp with time zone + INTERVAL '1 month'`
    try
    {
    const count = await table.count({
        where: {
            createdAt: {
                [Op.gte]: sequelize.literal(`${queryString[0]}`),
                [Op.lt]: sequelize.literal(`${queryString[1]}`)
            }
        }
     });
     return {month: date.split("-")[1], count: count};
    } catch (err)
    {
        console.log("EMPTY: " ,err);
        return {month: date.split("-")[1], count: 0};
        
    }  
}


async function getQuantityFeedback(mode, date)
{
    let queryString = [];
    let previousMonth = generateLastMonth(date);
    if(mode === "month")
    {
        
        let thisMonth = await getQuantityPerMonth("feedback", date)
        let lastMonth = await getQuantityPerMonth("feedback", previousMonth);
        return {thisMonth, lastMonth};
                                           
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

async function getQuantityRequestPerMonth(areaID)
{
    try {
        const counts = await models.create_request.findAll({
            attributes: [
                [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "createdAt"')), 'month'],
                'areaID', // Include areaID in the results
                [sequelize.fn('COUNT', sequelize.col('*')), 'count'] // Count all records for each areaID and month
            ],
            include: [
                {model: models.ad_content,
                include:[
                    {model: models.ad_place,
                    include: [
                        {model: models.place,
                        include: {model: models.area}, attributes: ['id']},
                    ]}
                ]},

            ],
            where: {
                id: areaID,
            },
            group: ['areaID', sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "createdAt"'))] // Group by areaID and month
        });

        // Create an array to store counts for each month, initialized to 0
        const monthlyCounts = {};

        // Update the object with the actual counts from the database
        counts.forEach(count => {
            const areaID = count.get('areaID');
            const monthIndex = count.get('month') - 1;

            // Initialize the area in the object if it doesn't exist
            if (!monthlyCounts[areaID]) {
                monthlyCounts[areaID] = { areaID, counts: Array.from({ length: 12 }, (_, idx) => ({ month: idx + 1, count: 0 })) };
            }

            // Update the count for the specific month
            monthlyCounts[areaID].counts[monthIndex].count = count.get('count');
        });

        return Object.values(monthlyCounts);
    } catch (err) {
        console.error("Error counting requests:", err);
        return [];
    }
}

async function getQuantityRequest (mode, date, areaID)
{
    if(mode === "month")
    {
        
        if (areaID === "all")
        {
            let previousMonth = generateLastMonth(date);
            let thisMonth = await getQuantityPerMonth("request", date)
            let lastMonth = await getQuantityPerMonth("request", previousMonth);
            return {thisMonth, lastMonth};
        }
        else
        {
            try
            {
                let data = await getQuantityRequestPerMonth(areaID);
                return data;

            }
            catch (err)
            {
                console.log("EMPTY: " ,err);
                return {count: 0};
            }
        }
    }
}



async function getQuantityAd(mode, date)
{
    let previousMonth = generateLastMonth(date);
    if(mode === "month")
    {
        let thisMonth = await getQuantityPerMonth("adPlace", date)
        let lastMonth = await getQuantityPerMonth("adPlace", previousMonth);
        return {thisMonth, lastMonth};
                                           
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