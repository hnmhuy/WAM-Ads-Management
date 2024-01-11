const controller = {};

const navBarData = require("../../nav_link.json");
const dataController = require("../../api/update_request")

controller.showAds = (req, res) => {
    // req.session.prev_url = req.originalUrl;
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
        jsHeader: [
            "/public/js/shared/handler_table_ui.js",
            "/public/js/maps/map.js",
            "/public/js/department/ad_place_ui_controller.js",
            "/public/js/department/ad_content_ui_controller.js"
        ],
    };
    res.render("department/ads", {
        layout: "department_layout",
        tabTitle: "QUẢN LÝ QUẢNG CÁO",
        jsHeader: componentDependcy.jsHeader,
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
        table1: locations,
    });
};

controller.showRequest = (req, res) => {
    req.session.prev_url = req.originalUrl;
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
        jsHeader: [
            "/public/js/shared/handler_table_ui.js",
            "/public/js/department/create_req_ui_controller.js"
        ],
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

function toTableDataRow(data) {
    return {
        id: data.id,
        status_col: true,
        attributes: [
            data.name, 
            data.address_formated,
            new Date(data.createdAt).toLocaleString('vi-VN'),
            data.last_name + " " + data.first_name,
            data.type === "ad_place" ? "Điểm đặt" : data.type === "ad_content" ? "Bảng quảng cáo" : "Không xác định",
        ],
        status_data: {
            status_text: data.status === 'sent' ? "Chưa xử lý" : data.status === 'cancel' ? "Đã từ chối" : data.status === 'accepted' ? "Đã xử lý" : "Không xác định",
            status_class: data.status === 'sent' ? 'status-location-active' : data.status === 'cancel' ? 'status-location-pending' : 'status-ad-accepted'
        },
        sidepeek_id: "update_detail"
    }
}

function toTableData(prefixId, tableHeading, data, areaId) {
    let res = {
        "table_id": `${prefixId}-${areaId}`,
        "heading": tableHeading,
        "data_row": []
    }   
    data.forEach((d) => {
        res["data_row"].push(toTableDataRow(d));
    });
    return res;
}

async function getUpdateReqData (prefixId, isResolved = false) {
    const tableHeading = [
        "Phường",
        "Địa chỉ chi tiết",
        "Thời gian gửi",
        "Người gửi",
        "Loại yêu cầu",
        "Trạng thái"
    ]
    let areaAndAmount = await dataController.getAmountOfDistrictByStatus(isResolved);
    if (areaAndAmount.success) {
        let data = areaAndAmount.data;
        var res = [];
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            let item = {};
            item.id = d.areaId;
            item.name = d.name;
            item.amount = d.amount;
            let reqList = await dataController.getUpdateReqListByArea(d.areaId, isResolved);
            item.data = {};
            if (reqList.success) {
                item.data = toTableData(prefixId, tableHeading, reqList.data, d.areaId);
            }
            res.push(item);
        }
        return res;
    } else return null;
}

controller.getTableData = async (req, res) => {
    let isResolved = req.query.isResolved;
    res.json(await getUpdateReqData(isResolved));
}

controller.showUpdate = async (req, res) => {
    let data_inprocess = await getUpdateReqData('inprocess-table');
    let date_processed = await getUpdateReqData('processed-table',true);
    req.session.prev_url = req.originalUrl;
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
        jsHeader: [
            "/public/js/shared/handler_table_ui.js",
            "/public/js/department/update_req_ui_controller.js"
        ],
    };
    res.render("department/update", {
        layout: "department_layout",
        jsHeader: componentDependcy.jsHeader,
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
        checked: "checked",
        data_inprocess: data_inprocess,
        data_processed: date_processed
    });
};

module.exports = controller;
