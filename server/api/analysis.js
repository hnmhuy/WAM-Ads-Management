const controller = {};
const models = require("../models");
const { Op, where } = require('sequelize');
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

async function getQuantityFeedbackGroupBy(mode, date)
{
    // Get all feedbacks for the given month and group them by the type (4 types)
    // Generate the date for period date
    const allCategories = await models.category.findAll({ attributes: ['id', 'name', 'createdAt'], where: {field_id: 'T4'}, order: [['createdAt', 'ASC']] });
    let startDate, endDate;
    if (mode === "period")
    {
        startDate = date.split("to")[0];
        endDate = date.split("to")[1].trim();
        console.log("Start: ",startDate);
        console.log("End: ", endDate);
    }
    else
    {
        startDate = endDate = date;
    }
    let queryString = [];
    console.log("The date: ", date);
    queryString[0] = `TIMESTAMP '${startDate} 00:00:00+00'::timestamp with time zone`;
    queryString[1] = `TIMESTAMP '${endDate} 23:59:59+00'::timestamp with time zone`
    try{
        let data = await models.feedback.findAll({
            attributes: [
                'type',
                    [
                        sequelize.fn(
                            'COUNT',
                            sequelize.literal('CASE WHEN "feedback"."status" = \'done\' THEN 1 END')
                        ),
                        'countDone'
                    ],
                        [sequelize.fn('COUNT', sequelize.col('feedback.id')), 'count']],
            where: { 
                createdAt: {
                [Op.gte]: sequelize.literal(`${queryString[0]}`),
                [Op.lt]: sequelize.literal(`${queryString[1]}`)
            }},
            group: ['type'],
        })

        const formatData = allCategories.map(category => {
            const feedbackData = data.find(item => item.dataValues.type === category.dataValues.id);
    
            return {
                categoryId: feedbackData ? feedbackData.dataValues.type : category.dataValues.id,
                categoryName: category.dataValues.name,
                count: feedbackData ? feedbackData.dataValues.count : 0,
                done: feedbackData ? feedbackData.dataValues.countDone : 0
            };
        });
    
        return formatData;
        
    }catch(error){
        console.log(error)
        return [];
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
    else if (mode === "date" || mode === "period")
    {
        let data = await getQuantityFeedbackGroupBy(mode, date);
        return data;
    }

    
}

async function getQuantityRequestPerMonth(areaID) 
{
    try {
        const currentDate = new Date();
        
        const startDate = new Date(Date.UTC(currentDate.getFullYear(), 0 , 1, 0, 0, 0, 0));
        console.log("START: ", startDate.toLocaleDateString(), startDate.toLocaleTimeString());
        const endDate = new Date(currentDate);

        let areaName = await models.area.findOne({
            attributes: ['name'],
            where: {
                id: areaID,
            }
        });
        areaName = areaName.name;

        const data = await models.create_request.findAll({
            attributes: [ 
                [sequelize.fn('date_trunc', 'month', sequelize.col('create_request.createdAt')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('create_request.id')), 'count']],
            where: {
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                },
                '$account.area.id$': areaID,
            },
            include: [
                {model: models.account, attributes: [],
                include: [
                    {model: models.area, attributes: []}]}
            ],
            group: ['month'],
            order: [['month', 'ASC']],
        })
        const monthsArray = [];
        let tempDate = new Date(startDate);

        while (tempDate<= endDate) {
            // Create a new Date with the same year and month, but set the day to 1
            const monthBeginning = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0, 17, 0, 0, 0);

            monthsArray.push(monthBeginning);

            console.log("Tempdate: ", tempDate);
            tempDate.setMonth(tempDate.getMonth() + 1);
        }

        const monthData = monthsArray.map(month => {
            const feedbackData = data.find(item => {
                let itemDate = item.dataValues.month;
                return (
                    itemDate &&
                    itemDate.getUTCFullYear() === month.getUTCFullYear() &&
                    itemDate.getUTCMonth() === month.getUTCMonth()
                );
            });
            // return {
            //     date: `${month.getFullYear()} - ${month.getMonth() + 1}`,
            //     count: feedbackData ? feedbackData.dataValues.count : 0
            // };
            return  feedbackData ? parseInt(feedbackData.dataValues.count) : 0;
        });
        
        return {areaName, monthData};
        
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
            console.log("DATA 1 : ", data);

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