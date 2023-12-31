const express = require("express");
const app = express();
const path = require("path");
const port = 3000 | process.env.port;
const expressHbs = require("express-handlebars");
app.use("/public", express.static(path.join(__dirname, "public")));
const hbs = expressHbs.create({});
var bodyParser = require("body-parser");

var accounts = require("./account");
var userIsAuthorised = false;

app.use(bodyParser.urlencoded({ extended: true }));

function passwordCheck(req, res, next) {
  userIsAuthorised = false;
  const password = req.body["password"];
  const email = req.body["email"];
  accounts.forEach((item) => {
    if (item.password === password && item.username === email) {
      userIsAuthorised = true;
    }
  });
  next();
}

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/partials/login.html");
});

app.use(passwordCheck);
app.post("/home", (req, res) => {
  console.log(userIsAuthorised);
  if (userIsAuthorised) {
    res.sendFile(__dirname + "/views/district/home.html");
  } else {
    res.sendFile(__dirname + "/views/partials/login.html");
  }
});

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

app.get("/login", (req, res) => {});
// Use routes of district
app.use("/home", require("./routes/district/home.route"));
app.use("/location", require("./routes/district/location.route"));
app.use("/reports", require("./routes/district/reports.route"));
app.use("/permission", require("./routes/district/permission.route"));

// Use routes of department
app.use("/dashboard", require("./routes/department/dashboard.route"));
app.use("/ads", require("./routes/department/ads.route"));
app.use("/label", require("./routes/department/label.route"));
app.use("/feedback", require("./routes/department/feedback.route"));

app.get("/deligate", (req, res) => {
  let navBarData = require("./nav_link.json");
  navBarData.nav_link.forEach((link) => {
    link.active = false;
  });

  const target = navBarData.nav_link.find((link) => link.name === "deligate");
  if (target) {
    target.active = true;
  }
  let componentDependcy = {
    css: ["/public/css/department/deligate.css"],
    swap: true,
    title: "QUẢN LÝ TÀI KHOẢN CÁN BỘ",
    jsHeader: ["/public/js/department/deligate_ui_controllers.js"],
  };
  res.render("department/deligate", {
    layout: "department_layout",
    css: componentDependcy.css,
    title: componentDependcy.title,
    nav_link: navBarData.nav_link,
    jsHeader: componentDependcy.jsHeader,
  });
});

app.get("/area", (req, res) => {
  let navBarData = require("./nav_link.json");
  navBarData.nav_link.forEach((link) => {
    link.active = false;
  });

  const target = navBarData.nav_link.find((link) => link.name === "area");
  if (target) {
    target.active = true;
  }
  let componentDependcy = {
    css: ["/public/css/department/area.css"],
    swap: true,
    title: "QUẢN LÝ KHU VỰC HÀNH CHÍNH",
    jsFooter: ["/public/js/department/area_ui_controller.js"],
  };
  res.render("department/area", {
    jsFooter: componentDependcy.jsFooter,
    layout: "department_layout",
    css: componentDependcy.css,
    title: componentDependcy.title,
    nav_link: navBarData.nav_link,
  });
});

// Testing fetch data
app.get("/data/area", (req, res) => {
  let districtId = req.query.districtId;
  // Convert to json object
  let data = require("./area.db.json");
  console.log(districtId);
  if (districtId) {
    data = data.commune.filter((item) => item.idDistrict === districtId);
  } else {
    data = data.district.filter((item) => item.idProvince === "79");
  }
  res.json(data);
});

app.listen(port, (req, res) => {
  console.log(`Server is running on ${port}`);
});
