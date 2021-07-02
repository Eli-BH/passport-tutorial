const User = require("./User");
const bcrypt = require("bcryptjs");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: "",
        clientSecret: "",
        callbackURL: "",
      },
      function (req, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });

        User.findOne({ googleId: profile.id }).then((currentUser) => {
          if (currentUser) {
            // already have this user
            console.log("user is: ", currentUser);
            done(null, currentUser);
          } else {
            // if not, create user in our db
            const verifiedEmail =
              profile.emails.find((email) => email.verified) ||
              profile.emails[0];
            new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: verifiedEmail.value,
            })
              .save()
              .then((newUser) => {
                req._user = newUser;
                console.log("created new user: ", newUser);
                done(null, newUser);
              })
              .catch((error) => console.log(error));
          }
        });
      }
    )
  );
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      cb(err, userInformation);
    });
  });
};
