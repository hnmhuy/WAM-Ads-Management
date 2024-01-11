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

const models = require('./models');
const User = require("./models").account;

app.use(cors({
  origin: 'http://localhost:3000', // or an array of allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // enable passing of cookies and other credentials
  optionsSuccessStatus: 204,  // respond to preflight requests with 204 (No Content)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const initializePassport = require("./passportConfig");
const { randomBytes } = require("crypto");
const { profile } = require("console");
// initializePassport(passport);

app.get("/createTables", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.redirect("/api/category/restoreField")
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
app.use(passport.session());

passport.use(new googleStrategy({
  clientID: '900777213307-q8qc0tphopvtmke922drco89a94pk6ph.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:4000/auth/google/callback',
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  req.bind_account = false;
  if (req.session.bind) {
    let user_bind_account = await User.findOne({ where: { bindAccount: profile.emails[0].value } });
    if (user_bind_account) {
      req.isExisted = true;
    } else {
      await models.account.update(
        {
          bindAccount: profile.emails[0].value,
        },
        { where: { id: req.session.user.id } }
      );
      req.session.user.bindAccount = profile.emails[0].value;
    }
    req.bind_account = true;
    req.cur_user = req.session.user;
  }
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

expressHbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
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

app.use('/createTmp', (req, res) => {
  // models.ad_content.create({
  //   company_name: "Công ty TNHH ABC",
  //   width: 1,
  //   height: 2,
  //   description: "Công ty okela",
  //   start: "2023-12-28 10:41:28.403 +0700",
  //   end: "2024-1-28 10:41:28.403 +0700",
  //   image1: "/public/images/location3.png",
  //   image2: "/public/images/location3.png",
  //   ad_place_id: "c2ead701-d057-438f-9bcd-6c32520cb860"
  // })

  // models.ad_content.create({
  //   company_name: "Công ty TNHH BCD",
  //   width: 4,
  //   height: 5,
  //   description: "Công ty okela",
  //   start: "2023-12-28 10:41:28.403 +0700",
  //   end: "2024-1-28 10:41:28.403 +0700",
  //   image1: "/public/images/location3.png",
  //   image2: "/public/images/location3.png",
  //   ad_place_id: "c2ead701-d057-438f-9bcd-6c32520cb860"
  // })

  // models.ad_content.create({
  //   company_name: "Công ty TNHH CDE",
  //   width: 4,
  //   height: 5,
  //   description: "Công ty okela",
  //   start: "2023-12-28 10:41:28.403 +0700",
  //   end: "2024-1-28 10:41:28.403 +0700",
  //   image1: "/public/images/location3.png",
  //   image2: "/public/images/location3.png",
  //   ad_place_id: "156e20c3-2688-4bb8-b1b8-612d3cc7a5bd"
  // })

  // models.ad_content.create({
  //   company_name: "Công ty TNHH DEF",
  //   width: 4,
  //   height: 5,
  //   description: "Công ty okela",
  //   start: "2023-12-28 10:41:28.403 +0700",
  //   end: "2024-1-28 10:41:28.403 +0700",
  //   image1: "/public/images/location3.png",
  //   image2: "/public/images/location3.png",
  //   ad_place_id: "156e20c3-2688-4bb8-b1b8-612d3cc7a5bd"
  // })

  models.feedback.create({
    name: "Fa Ngọc Uyển Nhi",
    email: "fnunhi21@clc.fitus.edu.vn",
    phone: "0123456789",
    content: "Biển quảng cáo này không phù hợp ở đây!",
    image1: "./uploads/ad_place/6aa227520e21d8e76c9d84460db3a3fe",
    ad_id: "6c63b41d-5d31-46ae-b921-cf01ebf19ecd"
  })

  res.send("Success")
})

app.listen(port, (req, res) => {
  console.log(`http://localhost:${port}`);
});


app.get("/createResponse", (req, res) => {
  models.feedback_response.create({
    content: "hehe",
    officer: null,
  })
  res.send("success");
})



app.get("/createRequest", (req, res) => {
  models.create_request.create({
    status: 'not sent',
  })
  res.send("success");
})

app.get("/createAdContent", (req, res) => {
  models.ad_content.create({
    company_name: 'HOHO',
  })
  res.send("success");
})
// CAPTCHA ver2
app.use(cors());

