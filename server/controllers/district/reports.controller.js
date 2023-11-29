const controller = {}
const data = require('../../testing_vew_data/available-location-reports.json');

controller.show = (req, res) => {
    res.locals.page_name = "Danh sách cấp phép";
    res.locals.data_row = data.data_row;
    res.locals.ward = data.ward;

    res.render('district/reports', { layout: 'district_layout' });
}


module.exports = controller