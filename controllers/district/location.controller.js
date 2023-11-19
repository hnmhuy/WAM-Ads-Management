const controller = {}
const { locations } = require('../../data')

controller.show = (req, res) => {
    var name = "Danh sách địa điểm quảng cáo"
    let data_table = require('../../ads_panel.json')
    let ads_location_data = require('../../locations_data_collapsible.json')
    res.render('district/location', { layout: 'list', name: name, table1: ads_location_data,table2:data_table });
}

module.exports = controller