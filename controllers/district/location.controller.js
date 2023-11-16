const controller = {}
const { locations } = require('../../data')

controller.show = (req, res) => {
    var name = "Danh sách địa điểm quảng cáo"
    res.render('district/location', { layout: 'list', name: name, heading: locations.heading, row: locations.row });
}

module.exports = controller