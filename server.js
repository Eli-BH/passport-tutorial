const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");

const cookieParser = require("cookie-parser");

const session = require("express-session");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = 3001;

mongoose.connect("mongodb://localhost/authPassportDB", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

require("./passport")(passport);
require("./passportGoogle")(passport);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secretTunnel",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//end of middleware

//routes
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
