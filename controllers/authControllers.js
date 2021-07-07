const bcrypt = require("bcryptjs");
const User = require("../Models/User");

// Register a user
// POST
exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    streetAddress,
    addressLine2,
    city,
    state,
    zipCode,
    //longitude,
    //latitude,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).send("User already exists");
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPass,
      phoneNumber: phoneNumber,
      streetAddress: streetAddress,
      addressLine2: addressLine2,
      city: city,
      state: state,
      zipCode: zipCode,
      //longitude,
      //latitude,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
};

//Login a user
//POST
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send({ message: "Successfully Authenticated", user });
        console.log(req.user);
      });
    }
  })(req, res, next);
};

//Google Callback
//GET
exports.callbackGoogle = (req, res) => {
  res.redirect("/profile");
};

//facebook Callback
//GET
exports.callbackFacebook = (req, res) => {
  res.redirect("/profile");
};

//Get Profile
//GET
exports.profile = (req, res) => {
  res.send(req.user);
};

//Get address
//GET

exports.getAddress = (req, res) => {
  const { streetAddress, address2, city, state, zipCode } = req.user;
  res.send({
    streetAddress,
    address2,
    city,
    state,
    zipCode,
  });
};

//Logout
//get

exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
};
