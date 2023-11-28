const controller = {}
const { reports } = require('../../data')
const { other_reports } = require('../../data')

controller.show = (req, res) => {
    res.locals.page_name = "Danh sách cấp phép"
    res.render('district/reports', { layout: 'district_layout' });
}


module.exports = controller