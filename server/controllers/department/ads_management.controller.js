const controller = {};

const navBarData = require("../../nav_link.json");

controller.show = (req, res) => {
    let locations = require("../../testing_vew_data/locations_data.json");
    let locations_collapsible = require("../../testing_vew_data/locations_data_collapsible.json");
    let req_update = require("../../testing_vew_data/req_update.json");
    let ad_infomation = require("../../testing_vew_data/ad_data_collapsible.json");
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });
    const target = navBarData.nav_link.find((link) => link.name === "ads");
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department/ads_management.css"],
        swap: true,
        title: "QUẢN LÝ QUẢNG CÁO",
        js: ["/public/js/shared/handler_table_ui.js"],
    };
    res.render("department/ads_management", {
        layout: "department_layout",
        js: componentDependcy.js,
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
        table1: locations,
        table2: locations_collapsible,
        table3: req_update,
        table4: req_update,
        table_data: ad_infomation,
    });
};

module.exports = controller;
