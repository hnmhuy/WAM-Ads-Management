const controller = {}
const models = require('../../models');

controller.show = async (req, res) => {

    req.session.prev_url = req.originalUrl;
    res.locals.page_name = "Yêu cầu chỉnh sửa";
    let delegation = req.session.user.delegation;
    res.render("district/review_edit_request", {
        layout: "district_layout"
    })
}

module.exports = controller