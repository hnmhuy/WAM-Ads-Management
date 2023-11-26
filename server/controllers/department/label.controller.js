const controller = {};

controller.show = (req, res) => {
    let navBarData = require("../../nav_link.json");
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });

    const target = navBarData.nav_link.find((link) => link.name === "label");
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department_label.css"],
        swap: true,
        title: "QUẢN LÝ DANH MỤC",
    };
    res.render("department/label", {
        layout: "department_layout",
        css: componentDependcy.css,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
    });
};

module.exports = controller;
