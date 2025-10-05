const express = require("express");
const authRoutes = express.Router();
let userControler = require("../controller/authController");

authRoutes.route("/SignIn").post(userControler.signIn);

authRoutes.route("/login").post(userControler.login);

authRoutes.route("/forgatePassword").post(userControler.forgatePassword);
authRoutes.route("/resetPassword/:token").patch(userControler.resetpassword);

module.exports = authRoutes;
