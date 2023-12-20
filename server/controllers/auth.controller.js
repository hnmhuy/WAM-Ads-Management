const controller = {};
const User = require("../models").account;
const passport = require("passport");
const models = require("../models");

const bcrypt = require('bcrypt');

controller.showIndex = (req, res) => {
  res.redirect("/home");
};

controller.showLogin = async (req, res) => {
  let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";
  // if(req.session.user){
  //   return res.redirect(reqUrl);
  // }
  res.render("partials/login", { 
    reqUrl,
    email: req.signedCookies.email,
    password: req.signedCookies.password,
  });
};

controller.login = async (req, res) => {
  let { email, password, rememberMe } = req.body;
  if(!email || !password){
    return res.render("partials/login", {
      message: "Please enter all fields."
    })
  }
  console.log(req.body)
  let user = await User.findOne({
    attributes: [
        "id",
        "email",
        "first_name",
        "last_name",
        "status",
        "delegation",
        "password",
    ],
    include: [{model: models.area, attributes: ["parent_id"]}],
    where: { email: email},
  });
  console.log(user)
  if(user){
    console.log(password);
    console.log(user.password);
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log(passwordMatch)
    if(passwordMatch){
        if(user.status == "1"){
        let reqUrl = req.body.reqUrl ? req.body.reqUrl : "/";
        req.session.user = user;
        if(rememberMe){
          res.cookie("email", email, {
            maxAge: 60 * 60 * 1000,
            httpOnly: false,
            signed: true,
          });
          res.cookie("password", password, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            signed: true,
          });
        }
        if(user.delegation){
          return res.redirect("/home");
        }
        else{
          return res.render("department/dashboard");
        }
      }
      else{
        return res.render("partials/login", {
            message: "User is non-existed.",
        });
      }
    }
    else{
      return res.render("partials/login", {
        message: "Password is not correct"
      })
    }
  }
  else{
    res.render("partials/login", {
      message: "Email is not registered"
    })
  }
}

// controller.login = passport.authenticate('local', {
//     successRedirect: '/home',
//     failureRedirect: '/location',
//     failureFlash: true
// });

controller.logout = (req, res, next) => {
  req.session.destroy(function (error) {
    if(error) return next(error);
    res.redirect("/login");
  });
}

controller.isLoggedIn = async (req, res, next) => {
  if(req.session.user) {
    res.locals.user = req.session.user;
    return next();
  }
  res.redirect(`/login?reqUrl=${req.originalUrl}`);
}

controller.showHome = (req, res) => {
    res.locals.page_name = "Trang chủ"
    res.render('district/home', { layout: "district_layout" })
}

controller.showLocation = (req, res) => {
    res.locals.page_name = "Danh sách điểm quảng cáo"
    res.locals.data_rows = location.data_rows;
    res.render('district/location', { layout: 'district_layout' });
}

controller.showPermission = (req, res) => {
    res.locals.page_name = "Danh sách cấp phép"
    res.render('district/permission', { layout: 'district_layout' });
}

controller.showReport = (req, res) => {
    res.locals.page_name = "Danh sách cấp phép";
    res.locals.data_row = data.data_row;
    res.locals.ward = data.ward;

    res.render('district/reports', { layout: 'district_layout' });
}

module.exports = controller;
