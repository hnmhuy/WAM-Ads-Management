const controller = {};

const navBarData = require("../../nav_link.json");

controller.show = (req, res) => {
    navBarData.nav_link.forEach((link) => {
      link.active = false;
    });
  
    const target = navBarData.nav_link.find((link) => link.name === "area");
    if (target) {
      target.active = true;
    }
    let componentDependcy = {
      css: ["/public/css/department/area.css"],
      swap: true,
      title: "QUẢN LÝ KHU VỰC HÀNH CHÍNH",
      jsFooter: ["/public/js/department/area_ui_controller.js"],
    };
    res.render("department/area", {
      jsFooter: componentDependcy.jsFooter,
      layout: "department_layout",
      css: componentDependcy.css,
      title: componentDependcy.title,
      nav_link: navBarData.nav_link,
    });
};

module.exports = controller;
