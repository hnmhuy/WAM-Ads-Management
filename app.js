const express = require("express");
const hbs = require('express-handlebars');
const port = 3000 | process.env.port

// Import router for district
const homeRouterDistrict = require('./src/routes/district/home.route.js');
const locationRouterDistrict = require('./src/routes/district/location.route.js');
const loginRouterDistrict = require('./src/routes/district/login.route.js');
const permissionRouterDistrict = require('./src/routes/district/permission.route.js');
const reportsRouterDistrict = require('./src/routes/district/reports.route.js');


const app = express();


app.engine("hbs", hbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout"
}))
app.set("view engine", "hbs")


// Routes
// app.use('/', homeRouterDistrict)
// app.use('/location', locationRouterDistrict)
app.use('/login', loginRouterDistrict)
// app.use('/permission', permissionRouterDistrict)
// app.use('/reports', reportsRouterDistrict)
// app.use("/public", express.static(path.join(__dirname, "src", "public")));


// Error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
