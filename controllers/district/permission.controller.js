const controller = {}
const { permissions } = require('../../data')

controller.show = (req, res) => {
    var name = "Danh sách cấp phép"
    res.render('district/permission', { layout: 'list', name: name, heading: permissions.heading, row: permissions.row });
}

module.exports = controller