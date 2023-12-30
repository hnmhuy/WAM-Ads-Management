// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');
// const { User } = require('./models'); // Adjust the path to your Sequelize User model

// function initialize(passport) {
//   const authenticateUser = async (email, password, done) => {
//     try {
//       const user = await User.findOne({ where: { email: email } });

//       if (!user) {
//         return done(null, false);
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (isMatch) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     } catch (err) {
//       return done(err);
//     }
//   }

//   passport.use(new LocalStrategy({
//     emailField: 'email',
//     passwordField: 'password',
//   }, authenticateUser));

//   passport.serializeUser((user, done) => done(null, user.id));

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findByPk(id);

//       if (!user) {
//         return done(null, false);
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   });
// }

// module.exports = initialize;