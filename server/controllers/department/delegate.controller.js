const controller = {};

const navBarData = require("../../nav_link.json");

controller.show = (req, res) => {
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });

    const target = navBarData.nav_link.find((link) => link.name === "delegate");
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department/delegate.css"],
        swap: true,
        title: "QUẢN LÝ TÀI KHOẢN CÁN BỘ",
        jsHeader: ["/public/js/department/delegate_ui_controllers.js"],
    };
    res.render("department/delegate", {
        layout: "department_layout",
        tabTitle: "QUẢN LÝ TÀI KHOẢN CÁN BỘ",
        css: componentDependcy.css,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
        jsHeader: componentDependcy.jsHeader,
    });
};

module.exports = controller;
