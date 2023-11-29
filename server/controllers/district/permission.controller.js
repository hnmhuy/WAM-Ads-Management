const controller = {}

controller.show = (req, res) => {
    res.locals.page_name = "Danh sách cấp phép"
    res.render('district/permission', { layout: 'district_layout' });
}

module.exports = controller