const controller = {}
const location = require('../../testing_vew_data/location.json');

controller.show = (req, res) => {
    res.locals.page_name = "Danh sách điểm quảng cáo"
    res.locals.data_rows = location.data_rows;
    res.render('district/location', { layout: 'district_layout' });
}

module.exports = controller