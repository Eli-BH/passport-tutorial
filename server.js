const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const User = require("./User");
const passportLocal = require("passport-local");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const port = 3001;

mongoose.connect("mongodb://localhost/authDB", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
require("./passport")(passport);
require("./passportGoogle")(passport);
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieParser("secretcode"));
app.use(
  session({
    secret: "secretTunnel",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//-------End of Middleware

//Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});
app.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});
app.get("/user", (req, res) => {
  res.send(req.user);
  console.log(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get("/google/user", (req, res) => {
  console.log(req.user);
});

app.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.send(req.user);
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
