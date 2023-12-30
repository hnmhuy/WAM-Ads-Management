const controller = {}

controller.show = (req, res) => {
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Trang chủ"
    res.render('district/home', { layout: "district_layout" })
}

module.exports = controller