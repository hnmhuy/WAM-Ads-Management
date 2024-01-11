const controller = {};

controller.show = (req, res) => {
    // req.session.prev_url = req.originalUrl;
    let navBarData = require("../../nav_link.json");
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });

    const target = navBarData.nav_link.find((link) => link.name === "label");
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department/label.css"],
        swap: true,
        title: "QUẢN LÝ DANH MỤC",
        jsHeader: ["/public/js/department/label_ui_controllers.js"],
    };
    res.render("department/label", {
        layout: "department_layout",    
        tabTitle: "QUẢN LÝ DANH MỤC",
        jsHeader: componentDependcy.jsHeader,
        css: componentDependcy.css,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
    });
};

module.exports = controller;
