const express = require("express");
const app = express();
const path = require("path");
const port = 3000 | process.env.port;
const expressHbs = require("express-handlebars");
app.use("/public", express.static(path.join(__dirname, "public")));
const hbs = expressHbs.create({});

app.engine(
    "hbs",
    expressHbs.engine({
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials",
        extname: "hbs",
        defaultLayout: "layout",
    })
);
app.set("view engine", "hbs");

// Register the helper
hbs.handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// Login
app.get("/", (req, res) => {
    res.render("index");
});
// Use routes of district
app.use("/home", require("./routes/district/home.route"));
app.use("/location", require("./routes/district/location.route"));
app.use("/reports", require("./routes/district/reports.route"));
app.use("/permission", require("./routes/district/permission.route"));

app.get("/testing/dashboard", (req, res) => {
    let navBarData = require("./nav_link.json");
    //set all active = false
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });

    const target = navBarData.nav_link.find(
        (link) => link.name === "dashboard"
    );
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department_dashboard.css"],
        swipe: false,
        title: "SỐ LIỆU THỐNG KÊ",
    };
    res.render("department/dashboard", {
        layout: "department_layout",
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
    });
});

app.get("/testing/ads", (req, res) => {
    let locations = require("./locations_data.json");
    let navBarData = require("./nav_link.json");
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });
    console.log(locations);
    const target = navBarData.nav_link.find((link) => link.name === "ads");
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department_ads.css"],
        swap: true,
        title: "QUẢN LÝ QUẢNG CÁO",
    };
    res.render("department/ads_location", {
        layout: "department_layout",
        css: componentDependcy.css,
        swap: componentDependcy.swap,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
        table_data: locations,
    });
});

app.get("/testing/label", (req, res) => {
    let navBarData = require("./nav_link.json");
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });

    const target = navBarData.nav_link.find((link) => link.name === "label");
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department_label.css"],
        swap: true,
        title: "QUẢN LÝ DANH MỤC",
    };
    res.render("department/label", {
        layout: "department_layout",
        css: componentDependcy.css,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
    });
});

app.get("/testing/deligate", (req, res) => {
    let navBarData = require("./nav_link.json");
    navBarData.nav_link.forEach((link) => {
        link.active = false;
    });

    const target = navBarData.nav_link.find((link) => link.name === "deligate");
    if (target) {
        target.active = true;
    }
    let componentDependcy = {
        css: ["/public/css/department_deligate.css"],
        swap: true,
        title: "QUẢN LÝ TÀI KHOẢN CÁN BỘ",
    };
    res.render("department/deligate", {
        layout: "department_layout",
        css: componentDependcy.css,
        title: componentDependcy.title,
        nav_link: navBarData.nav_link,
    });
});

app.listen(port, (req, res) => {
    console.log(`Server is running on ${port}`);
});
