const controller = {};
const User = require("../models").account;
const passport = require("passport");
const models = require("../models");
const bcrypt = require('bcrypt');
const OTPmodel = require('../models').OTP;

const location = require('../testing_vew_data/location.json');
const {sendOTP} = require("../controllers/otp.controller")

controller.showIndex = (req, res) => {
  if(req.session.prev_url){
    res.redirect(req.session.prev_url);
  }
  res.redirect("/login");
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
  console.log(req.body)
  let { email, password, rememberMe } = req.body;
  if(!email || !password){
    return res.render("partials/login", {
      layout: "login_layout",
      message: `<p style="color: red; font-weight: 600;">* Hãy điền đầy đủ các ô.</p>`
    })
  }
  let user = await User.findOne({
    attributes: [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone",
        "dob",
        "areaLevel",
        "status",
        "delegation",
        "password",
        "bindAccount",
    ],
    include: [{model: models.area, attributes: ["parent_id"]}],
    where: { email: email},
  });
  if(user){
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(passwordMatch){
      if(user.status === "active"){
        let reqUrl = "";
        if(user.areaLevel == 1 || user.areaLevel == 2){
          reqUrl = req.body.reqUrl ? req.body.reqUrl : "/home";
        }
        else if(user.areaLevel == 0){
          reqUrl = req.body.reqUrl ? req.body.reqUrl : "/dashboard";
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
        console.log(reqUrl);
        return res.redirect(reqUrl);
      }
      else{
        return res.render("partials/login", {
          layout: "login_layout",
          message: `<p style="color: red; font-weight: 600;">* Tài khoản đã bị khoá.</p>`
        });
      }
    }
    else{
      return res.render("partials/login", {
        layout: "login_layout",
        message: `<p style="color: red; font-weight: 600;">* Mật khẩu không đúng.</p>`
      })
    }
  }
  else{
    res.render("partials/login", {
      layout: "login_layout",
      message: `<p style="color: red; font-weight: 600;">* Email chưa được đăng ký.</p>`
    })
  }
}

controller.logout = (req, res, next) => {
  req.logout(function(err) {
    req.session.destroy(function (error) {
      if(error) return next(error);
      res.redirect("/login");
    });
  });
}

controller.showHome = async (req, res) => {
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
  req.session.prev_url = req.originalUrl;
  const bind_message = req.session.bind_message;
  req.session.bind_message = null;
  if(req.session.user.areaLevel == 0){
    const navBarData = require("../nav_link.json");
    navBarData.nav_link.forEach((link) => {
          link.active = false;
      });  
    let componentDependcy = {
      css: ["/public/css/shared/profile.css"],
      jsHeader: ["/public/js/shared/profile.js"],
    };
    res.render("partials/profile", {
      layout: "profile_department_layout",
      jsHeader: componentDependcy.jsHeader,
      css: componentDependcy.css,
      title: componentDependcy.title,
      nav_link: navBarData.nav_link,
      bind_message: bind_message,
    });
  }
  res.render("partials/profile", {
    layout: "district_layout",
    bind_message: bind_message,
  });
}

controller.isLoggedIn = async (req, res, next) => {
  if(req.session.user) {
    if(req.isAuthenticated()){
      res.locals.user = req.session.user;
    } else {
      res.locals.user = req.session.user;
    }
    return next();
  }
  res.redirect(`/login?reqUrl=${req.originalUrl}`);
}

controller.isOfficer = async(req, res, next)=>{
  
  if(req.session.user.areaLevel == 2 || req.session.user.areaLevel == 1)
    return next();
  res.redirect(req.session.prev_url);
}

controller.isDepartment = async(req, res, next)=>{
  if(req.session.user.areaLevel == 0){
    return next();
  }
  res.redirect(`${req.prev_url}`);
}

controller.changeProfile = async(req, res) =>{
  const user = req.session.user;
  let {newFirstName, newLastName, newDOB, newContact, email} = req.body;
  let check = await User.findOne({
    attributes:[
      "id"
    ],
    where: {email},
  });
  if(check && (check.id != user.id)){
    res.json({
      message: "Email đã tồn tại.",
      data: req.session.user,
      updateSuccess: false,
    })
  } else {
      try{
      await models.account.update(
        {
          first_name: newFirstName, last_name: newLastName, dob: newDOB, phone: newContact, email: email,
        },
        { where: {id: user.id}}
      );
      req.session.user.first_name = newFirstName;
      req.session.user.last_name = newLastName;
      req.session.user.email = email;
      req.session.user.dob = newDOB;
      req.session.user.phone = newContact;

      res.json({
        message: "Cập nhật thành công",
        data: req.session.user,
        updateSuccess: true,
        firstName: newFirstName,
        lastName: newLastName,
      })
    } catch(error){
      res.json({
        message: error,
        data: req.session.user,
        updateSuccess: false,
      })
    }
  }
}

controller.changePassword = async(req, res, next) =>{
  const user = req.session.user;
  let {currentPassword, newPassword, confirmPassword} = req.body;
  
  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if(isMatch){
    if(newPassword.length >7){
      if(newPassword === confirmPassword){
        try{
          const newHashedPassword = await bcrypt.hash(newPassword, 10);
          await models.account.update(
            {
              password: newHashedPassword,
            },
            { where: {id: user.id}}
          );
          res.json({
            success: true,
            message: "Mật khẩu được thay đổi thành công",
            data: null
        })
        } catch(error){
            res.json({
                success: false,
                message: error,
                data: null
            })
        }
      }
      else{
        res.json({
            success: false,
            message: "Mật khẩu xác nhận và mật khẩu mới không khớp.",
            data: null
        })
      }
    } else {
        res.json({
          success: false,
          message: "Mật khẩu mới phải chứa ít nhất 8 ký tự",
          data: null
      })
    }
  }
  else{
    res.json({
        success: false,
        message: "Mật khẩu không đúng",
        data: null
    })
  }
}

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
  const {email} = req.body;

  let user = await User.findOne({
    where: { email: email},
  });
  if(user){
    duration = 1;
    subject = "Mã Xác Thực Tài Khoản"
    const createdOTP = await sendOTP({
        email,
        subject,
        duration
    });
    res.status(200).render("partials/otp", {
      layout: "login_layout",
      email: email,
    });
  } else {
    res.render("partials/login", {
      layout: "login_layout",
      forgot_message: `<p style="color: red; font-weight: 600;">* Tài khoản không tồn tại</p>`
    })
  }
  
}

controller.verify = async (req, res, next) => {
  const {email, otp} = req.body;
  try {
      const otpUser = await OTPmodel.findOne({
          attribute: [
              "email",
              "otp",
              "expireAt"
          ],
          where: {email}
      })
      if(otpUser){
        const isMatch = await bcrypt.compare(otp, otpUser.otp)
        if(isMatch){
          const timestamp = Date.now();
          const Datetime =  new Date(timestamp);
          if(otpUser.expireAt > Datetime){
            await OTPmodel.destroy({
                where: {email},
            });
            res.render("partials/resetPassword", {
              layout: "login_layout",
              email: email,
            });
          } else {
            res.render("partials/otp", {
              email: email,
              layout: "login_layout",
              message: `<p style="color: red; font-weight: 600;">* OTP quá hạn, hãy yêu cầu một OTP khác.</p>`
            })
          }
        } else {
          res.render("partials/otp", {
            email: email,
            layout: "login_layout",
            message: `<p style="color: red; font-weight: 600;">* OTP không đúng.</p>`
          })
        }
      }
  } catch (error) {
      throw error
  }
}

controller.showResetPassword = (req, res)=>{
  res.render("partials/resetPassword", {
    layout: "login_layout"
  });
}

controller.resetPassword = async (req, res)=>{
  const {password, confirmPassword, email} = req.body;
  if(password.length < 8){
    if(password === confirmPassword){
    let user = await User.findOne({
      attributes: [
          "password",
      ],
      where: { email: email},
    });
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        await models.account.update(
          {
            password: hashedPassword,
          },
          { where: {email}}
        );
        res.redirect("/login")
      } catch(error){
        res.send("Can not update user!");
        res.render("partials/resetPassword", {
        layout: "login_layout",
        email: email,
        message: `<p style="color: red; font-weight: 600;">* ${error}</p>`
      });
      }
    } else {
      res.render("partials/resetPassword", {
        layout: "login_layout",
        email: email,
        message: `<p style="color: red; font-weight: 600;">* Mật khẩu không khớp</p>`
      });
    }
  } else {
    res.render("partials/resetPassword", {
        layout: "login_layout",
        email: email,
        message: `<p style="color: red; font-weight: 600;">* Mật khẩu phải có ít nhất 8 ký tự</p>`
      });
  }
}

controller.bindAccount = async (req, res)=>{
  req.session.bind = true;
  req.session.isExisted = false;
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
}

controller.googleCallback = async (req, res, next) => {
  if(req.isExisted){
    req.session.user = req.cur_user;
    res.render("partials/profile", {
      user: req.cur_user,
      layout: "district_layout",
      bind_message: `<p style="color: red; font-weight: 800">Tài khoản gmail đã được liên kết, hãy thử gmail khác</p>`
    })
  } else {
    let user = await User.findOne({
      attributes: [
          "id",
          "email",
          "first_name",
          "last_name",
          "phone",
          "dob",
          "areaLevel",
          "status",
          "delegation",
          "password",
          "bindAccount",
      ],
      include: [{model: models.area, attributes: ["parent_id"]}],
      where: { bindAccount: req.user.emails[0].value},
    });
    if(user){
      req.session.user = user;
      res.locals.user = req.session.user;
      if(req.bind_account){
        req.session.bind_message = `<p id="bindMessage" style="color: green; font-weight: 800; display: none"></p>`
        res.redirect("/profile");
      } else {
        res.redirect("/");
      }
      
    } else {
      res.render("partials/login", {
        layout: "login_layout",
        message: `<p style="color:red; font-weight:800">Tài khoản gmail chưa liên kết</p>`
      })
    }
  }
  
}

controller.unbindAccount = async (req, res, next)=>{
  await models.account.update(
    {
      bindAccount: null,
    },
    { where: {id: req.session.user.id}}
  );
  req.session.user.bindAccount = null;
  // res.render("partials/profile", {
  //   layout: "district_layout",
  //   bind_message: `<p id="bindMessage" style="color: green; font-weight: 800;">Huỷ liên kết thành công</p>`
  // });
  res.json({
    success: true,
    message: "Hủy liên kết thành công",
  })
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
  var sortedDate = formattedDate.slice(6, 8) + formattedDate.slice(4, 6) + formattedDate.slice(0, 4);
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
    let resData = user.dataValues;
    resData.area = null;
    // Find the area instance
    if(resData.delegation) {
      models.area.findOne({
        attributes: ['id', 'name', 'parent_id', 'formatedName'],
        where: {id: resData.delegation}
      }).then(data => {
        resData.area = data;
        res.json({
          message: "success",
          data: user
        })
      }).catch(err => {
        res.json({
          message: "error",
          data: err.errors
        })
      })
    } else {
      res.json({
        message: "success",
        data: user
      })
    }
  }).catch(err => {
    res.json({
      message: "error",
      data: err.errors
    })
  })
}

module.exports = controller;
