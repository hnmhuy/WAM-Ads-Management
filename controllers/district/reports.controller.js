const controller = {}
const { reports } = require('../../data')

controller.show = (req, res) => {
    var name = "Danh sách báo cáo"
    res.render('district/reports', { layout: 'list', name: name, heading: reports.heading, row: reports.row });
}

module.exports = controller