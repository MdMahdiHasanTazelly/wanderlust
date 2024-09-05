const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const saveRedirectUrl = require('../middleware.js');

const userController = require("../controllers/user.js");

router.get("/logout", logout);

router
.route("/signup")
//rendering sign up form
.get( renderSignupForm )
//saving sign up data in DB and loggin in automatically
.post(wrapAsync( signup ));


router
.route("/login")
//rendering login form
.get(renderLoginForm )
//user authentication for login
.post( passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),
 login);

module.exports = router;