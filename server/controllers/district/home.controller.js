const controller = {}

controller.show = (req, res) => {
    console.log(process.env.mapbox_token);
    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Trang chủ"
    res.render('district/home', { layout: "district_layout", token: process.env.mapbox_token})
}

module.exports = controller