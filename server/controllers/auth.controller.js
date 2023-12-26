const controller = {};
const User = require("../models").account;
const passport = require("passport");
const models = require("../models");
const bcrypt = require('bcrypt');

const location = require('../testing_vew_data/location.json');

const JWT_SECRET = 'Top secret...'

controller.showIndex = (req, res) => {
  res.redirect("/home");
};

controller.showLogin = async (req, res) => {
  let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";
  if(req.session.user){
    return res.redirect(reqUrl);
  }
  res.render("partials/login", { 
    reqUrl,
    email: req.signedCookies.email,
    password: req.signedCookies.password,
    layout: "login_layout"
  });
};

controller.login = async (req, res) => {
  let { email, password, rememberMe } = req.body;
  if(!email || !password){
    return res.render("partials/login", {
      message: "Please enter all fields."
    })
  }
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
  if(user){
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(passwordMatch){
        if(user.status == "1"){
        let reqUrl = "";
        if(user.delegation){
          reqUrl = req.body.reqUrl ? req.body.reqUrl : "/home";
        }
        else{
          reqUrl = req.body.reqUrl ? req.body.reqUrl : "/department/dashboard";
        }

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

        return res.redirect(reqUrl);
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

controller.logout = (req, res, next) => {
  req.session.destroy(function (error) {
    if(error) return next(error);
    res.redirect("/login");
  });
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

controller.showProfile = (req, res) =>{
  res.render("partials/profile", {
    layout: "district_layout"
  });
}

controller.isLoggedIn = async (req, res, next) => {
  if(req.session.user) {
    res.locals.user = req.session.user;
    return next();
  }
  if(req.isAuthenticated()) {
    const lastName = req.user.name.familyName;
    const firstName = req.user.name.givenName;
    const email = req.user.emails[0].value;
    const user = {last_name: lastName,first_name: firstName,email: email};
    res.locals.user = user;
    return next();
  }
  res.redirect(`/login?reqUrl=${req.originalUrl}`);
}

controller.changeProfile = async(req, res) =>{
  const user = req.session.user;
  let {newFirstName, newLastName, email} = req.body;
  try{
    await models.account.update(
      {
        first_name: newFirstName, last_name: newLastName
      },
      { where: {id: user.id}}
    );
    req.session.user.first_name = newFirstName;
    req.session.user.last_name = newLastName;
    req.session.user.email = email;
    res.redirect("/profile");
  } catch(error){
    res.send("Can not update user!");
    console.log(error);
  }
}

controller.changePassword = async(req, res, next) =>{
  const user = req.session.user;
  let {currentPassword, newPassword, confirmPassword} = req.body;

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if(isMatch){
    if(newPassword === confirmPassword){
      try{
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await models.account.update(
          {
            password: newHashedPassword,
          },
          { where: {id: user.id}}
        );
        res.redirect("/logout")
      } catch(error){
        res.send("Can not update user!");
        console.log(error);
      }
    }
    else{
      console.log("Mật khẩu xác nhận và mật khẩu mới không khớp");
    }
  }
  else{
    console.log("Mật khẩu không đúng");
  }
}

let tmp_user = {
  id: "U000",
  email: "kenshiro.pn@gmail.com",
  password: "asiodjaosdjasdoi",
};

const sendPasswordResetOTPEmail = async(email) => {
  try {
    //check if the account exists
    const {email} = req.body;
    if(email === tmp_user.email){
      const otpDetails = {
        email,
        subject: "Password Reset",
        message: "Enter the code below to reset your password",
        duration: 1,
      }
    }else{
      console.log("User does not exist");
    }
  } catch (error) {
    
  }
}

controller.forgotPassword = async (req, res) =>{
  try {
    const {email} = req.body;

  } catch (error) {
    
  }
}

// controller.forgotPassword = async(req, res)=>{
//   let {email} = req.body;
//   if(email === tmp_user.email);
//   const secret = JWT_SECRET + tmp_user.password;
//   const payload = {
//     emai: tmp_user.email,
//     id: tmp_user.id,
//   }
//   const token = jwt.sign(payload, secret, {expiresIn: '15m'});
//   const link = `http://localhost:3000/forgotPassword/${tmp_user.id}/${token}`;
//   console.log(link);
//   res.send("Password reset link has been sent to your email");
// }

// controller.showTokenForgotPassword = async(req, res, next) =>{
//   const {id, token} = req.params;
//   if(id === tmp_user.id){
//     const secret = JWT_SECRET + tmp_user.password;
//     try {
//       const payload = jwt.verify(token, secret);
//       res.render("partials/forgotPassword", {
//         email: tmp_user.email
//       })
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   else{
//     console.log("User does not exist.")
//   }
// }

// controller.tokenForgotPassword  = async(req, res, next) =>{
//   const {id, token} = req.params;
//   const {password, confirmPassword} = req.body;
//   if(id === tmp_user.id){
//     const secret = JWT_SECRET + tmp_user.password;
//     try {
//       const payload = jwt.verify(token, secret);
//       if(password === confirmPassword){
//         tmp_user.password = password;
//         res.send(tmp_user);
//       }else{
//         console.log("Password must match");
//       }

//     } catch (error) {
//       console.log(error.message);
//     }
//   } else{
//     console.log("User does not exist.");
//   }
// }

async function preprocessData(formData) {
  let {email, name, phone, dob, delegation, areaLevel} = formData;
  var formattedDate = dob.replace(/-/g, '');
  var sortedDate = formattedDate.slice(4, 8) + formattedDate.slice(0, 2) + formattedDate.slice(2, 4);
  const hashedPassword = await bcrypt.hash(sortedDate, 10); 
  const nameParts = name.split(' ');

  // The first part is the last name
  const lastName = nameParts.shift();

  // The remaining parts are the first name
  const firstName = nameParts.join(' ');

  areaLevel = parseInt(areaLevel);
  if(delegation === '') {
    delegation = null;
  }

  return {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
    phone: phone,
    areaLevel: areaLevel,
    delegation: delegation,
    dob: dob
  }
}

controller.register = async (req, res) => {
  
  const userData = await preprocessData(req.body);
  await User.create({
    email: userData.email,
    first_name: userData.firstName,
    last_name: userData.lastName,
    password: userData.password,
    phone: userData.phone,
    areaLevel: userData.areaLevel,
    delegation: userData.delegation,
    dob: userData.dob
  }).then(user => {
    res.json({
      message: "success",
      data: user
    })
  }).catch(err => {
    res.json({
      message: "error",
      data: err
    })
  })
}

module.exports = controller;
