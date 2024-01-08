const express = require("express");
const app = express();
const path = require("path");
const port = 5000 || process.env.port;
const expressHbs = require("express-handlebars");
app.use("/public", express.static(path.join(__dirname, "public")));
const hbs = expressHbs.create({});
var bodyParser = require("body-parser");
const cookiesParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const initializePassport = require('./passportConfig');
initializePassport(passport);
const User = require("./models").account;
var models = require("./models")
const bcrypt = require('bcrypt');

app.get("/createTables", (req, res) => {
  let models = require('./models');
  models.sequelize.sync().then(() => {
    res.send("Create Tables");
  })
})

app.use(cookiesParser('COOKIE_SECRET'));
app.use(
  session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie:{
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    }
  })
);

app.use(passport.initialize());
app.use(passport.session())

var accounts = require("./account");
const account = require("./models/account");

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


app.post("/deligate", async(req, res)=>{
  console.log(req.body);
  let {email, name, contact, dob} = req.body;
  console.log(dob);
  var formattedDate = dob.replace(/-/g, '');
  var sortedDate = formattedDate.slice(4, 8) + formattedDate.slice(0, 2) + formattedDate.slice(2, 4);
  const hashedPassword = await bcrypt.hash(sortedDate, 10); 
  const nameParts = name.split(' ');

  // The first part is the last name
  const lastName = nameParts.shift();

  // The remaining parts are the first name
  const firstName = nameParts.join();

  const totalUsers = await User.count();
  const id = "U" + (totalUsers + 1);
  

  try {
      await User.create({email: email, first_name: firstName, last_name: lastName, createdAt: new Date().toDateString(), updatedAt: new Date().toDateString(), password: hashedPassword, id: id, status: null, delegation: "201" });
      return res.redirect("/deligate")
    } catch (error) {
      if(error) throw error;
      return res.redirect("/deligate")
    }

})

app.listen(port, (req, res) => {
  console.log(`Server is running on ${port}`);
});