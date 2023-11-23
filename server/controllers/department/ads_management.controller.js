const controller = {};

const navBarData = require("../../nav_link.json");

controller.show = (req, res) => {
    let locations = require("../../testing_vew_data/locations_data.json");
    let locations_collapsible = require("../../testing_vew_data/locations_data_collapsible.json");
    let ad_infomation = require("../../testing_vew_data/ad_data_collapsible.json");
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });
    console.log(locations);
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
        table_data: ad_infomation,
    });
};

module.exports = controller;
