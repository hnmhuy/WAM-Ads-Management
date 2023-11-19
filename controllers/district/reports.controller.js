const controller = {}
const { reports } = require('../../data')

controller.show = (req, res) => {
    let table_data = require("../../reports_table_collapsible.json");
    console.log(table_data);
    var name = "Danh sách báo cáo"
    res.render('district/reports', { layout: 'list', name: name, heading: reports.heading, collapsible_row: reports.row, table_data: table_data });
}

module.exports = controller