const controller = {}
const { reports } = require('../../data')
const { other_reports } = require('../../data')

controller.show = (req, res) => {
    var name = "Danh sách báo cáo"
    res.render('district/reports', { layout: 'list', name: name, heading: reports.heading, collapsible_row: reports.row, other_heading: other_reports.heading, other_collapsible_row: other_reports.row });
}

module.exports = controller