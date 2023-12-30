const controller = {}

controller.show = (req, res) => {
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Danh sách cấp phép"
    res.render('district/permission', { layout: 'district_layout' });
}

module.exports = controller