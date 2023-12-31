const controller = {};

const navBarData = require("../../nav_link.json");

controller.showAds = (req, res) => {
    let locations = require("../../testing_vew_data/locations_data.json");
    
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
        jsHeader: ["/public/js/shared/handler_table_ui.js"],
    };
    res.render("department/ads", {
        layout: "department_layout",
        jsHeader: componentDependcy.js,
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
        table1: locations,
    });
};

controller.showRequest = (req, res) => {
    let locations_collapsible = require("../../testing_vew_data/locations_data_collapsible.json");
    let req_update = require("../../testing_vew_data/req_update.json");
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
        jsHeader: ["/public/js/shared/handler_table_ui.js"],
    };
    res.render("department/request", {
        layout: "department_layout",
        jsHeader: componentDependcy.jsHeader,
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
        checked: "checked",
        table1: locations_collapsible,
        table2: req_update,
        table3: req_update,
    });
};

module.exports = controller;
