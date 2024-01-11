const controller = {};

const navBarData = require("../../nav_link.json");

controller.show = (req, res) => {
    // req.session.prev_url = req.originalUrl;
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });
    const target = navBarData.nav_link.find(
        (link) => link.name === "dashboard"
    );
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department/dashboard.css"],
        swipe: false,
        title: "SỐ LIỆU THỐNG KÊ",
    };
    res.render("department/dashboard", {
        layout: "department_layout",
        tabTitle: "THỐNG KÊ",
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
    });
};

module.exports = controller;
