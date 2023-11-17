const controller = {}

controller.show = (req, res) => {
    res.render('district/home', { layout: 'map' })
}

module.exports = controller