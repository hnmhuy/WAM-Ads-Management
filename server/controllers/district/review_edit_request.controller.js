const controller = {}

controller.show = (req, res) => {
    res.render("district/review_edit_request",{
        layout: "district_layout"
    })
}

module.exports = controller