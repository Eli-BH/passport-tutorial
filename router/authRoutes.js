const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const {
  register,
  login,
  callbackFacebook,
  callbackGoogle,
  profile,
  getAddress,
  logout,
} = require("../controllers/authControllers");

router.post("/login", login);

router.post("/register", register);

router.get("/user", profile);

router.get("/address", getAddress);

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.send(req.user);
  }
);

router.get("/google/callback", callbackGoogle);
router.get("/facebook/callback", callbackFacebook);

router.get("/auth/logout", logout);

module.exports = router;
