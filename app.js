const express = require("express")
const app = express()
const path = require("path")
const port = 3000 | process.env.port
const expressHbs = require("express-handlebars")

app.use(express.static(__dirname + "/public"));


app.engine("hbs", expressHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout"
}))
app.set("view engine", "hbs")


// Login
app.get("/", (req, res) => {
    res.render("index")
})
// Use routes of district
app.use("/home", require('./routes/district/home.route'))
app.use("/location", require('./routes/district/location.route'))
app.use("/reports", require('./routes/district/reports.route'))
app.use("/permission", require('./routes/district/permission.route'))

app.listen(port, (req, res) => {
    console.log(`Server is running on ${port}`)
})
