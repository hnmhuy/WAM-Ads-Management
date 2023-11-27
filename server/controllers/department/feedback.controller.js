const controller = {};

const navBarData = require("../../nav_link.json");

controller.show = (req, res) => {
  navBarData.nav_link.forEach((link) => {
    link.active = false;
  });

  const target = navBarData.nav_link.find((link) => link.name === "feedback");
  if (target) {
    target.active = true;
  }
  let componentDependcy = {
    css: ["/public/css/department/feedback.css"],
    swap: true,
    title: "XEM ĐƠN PHẢN ÁNH",
    js: ["/public/js/department/feedback_ui_controllers.js"],
  };
  res.render("department/feedback", {
    layout: "department_layout",
    css: componentDependcy.css,
    title: componentDependcy.title,
    nav_link: navBarData.nav_link,
    js: componentDependcy.js,
  });
};

module.exports = controller;
