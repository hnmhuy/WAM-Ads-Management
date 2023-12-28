const express = require("express");
const app = express();
const path = require("path");
const port = 4000 || process.env.port;
const expressHbs = require("express-handlebars");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const hbs = expressHbs.create({});
var bodyParser = require("body-parser");
const cookiesParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const facebookStrategy = require('passport-facebook');
const googleStrategy = require('passport-google-oauth20');
const cors = require("cors"); //use for captcha

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const initializePassport = require("./passportConfig");
const { randomBytes } = require("crypto");
initializePassport(passport);

app.get("/createTables", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("Create Tables");
  });
});

app.use(cookiesParser("COOKIE_SECRET"));
app.use(
  session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session())
passport.use(new googleStrategy({
  clientID: '465034546763-b9e5sei88fv81k72go64kkq14ks3e7rb.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile)
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use("/", require("./routes/auth.route"));
app.use("/otp", require("./routes/otp.route"));

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


app.get("/delegate", (req, res) => {
  let navBarData = require("./nav_link.json");
  navBarData.nav_link.forEach((link) => {
    link.active = false;
  });

  const target = navBarData.nav_link.find((link) => link.name === "delegate");
  if (target) {
    target.active = true;
  }
  let componentDependcy = {
    css: ["/public/css/department/delegate.css"],
    swap: true,
    title: "QUẢN LÝ TÀI KHOẢN CÁN BỘ",
    jsHeader: ["/public/js/department/delegate_ui_controllers.js"],
  };
  res.render("department/delegate", {
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

app.use("/api", require("./routes/api/api.route"));

// Tmp data for test
const models = require('./models');
app.use("/createTemp", (req, res) => {
  models.feedback.create({
    name: "Nguyễn Khang Hy",
    email: "khanghy@gmail.com",
    phone: "0987654321",
    status: 'sent',
    content: 'Điểm quảng cáo nhìn quá đẹp, mãi mê!',
    image1: "/public/images/location1.png",
    image2: "/public/images/location3.png",
    type: "09283565-b8ea-48e5-a722-ec26b3861e1d",
    place_id: "abd930ba-d46b-47ac-a55c-3204bce1cf2d"
  });
  res.send("Success")
})
app.listen(port, (req, res) => {
  console.log(`Server is running on ${port}`);
});


app.get("/createResponse", (req, res) => {
  models.feedback_response.create({
    content: "hahahahahahahahaha liuliu",
    officer: null,
  })
  res.send("success");
})

// CAPTCHA ver2
app.use(cors());

