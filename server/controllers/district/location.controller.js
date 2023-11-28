const controller = {}

controller.show = (req, res) => {
    res.locals.page_name = "Danh sách điểm quảng cáo"
    res.render('district/location', { layout: 'district_layout' });
}

module.exports = controller