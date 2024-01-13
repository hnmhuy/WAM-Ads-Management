// Import module
const express = require("express");
const app = express();
const path = require("path");
const expressHbs = require("express-handlebars");
var bodyParser = require("body-parser");
const cookiesParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');
const cors = require("cors"); //use for captcha
const models = require('./models');
const User = require("./models").account;
require('dotenv').config();

const hbs = expressHbs.create({});
const port = process.env.port || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const { randomBytes } = require("crypto");
// const { profile } = require("console");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Restore the database
app.get("/createTables", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.redirect("/api/category/restoreField")
  });
});

app.use(cookiesParser(process.env.cookie_secret));
app.use(
  session({
    secret: process.env.cookie_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: parseInt(process.env.session_expire),
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new googleStrategy({
  clientID: process.env.gg_client_id,
  clientSecret: process.env.gg_client_secret,
  callbackURL: `${process.env.host}/auth/google/callback`,
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
app.use("/delegate", require("./routes/department/delegate.route"));
app.use("/area", require("./routes/department/area.route"));

// Use routes of api
app.use("/api", require("./routes/api/api.route"));

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});

app.use(cors());

