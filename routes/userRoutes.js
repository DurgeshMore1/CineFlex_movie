const express = require("express");
const userRoutes = express.Router();
let authController = require("../controller/authController");
let userController = require("../controller/userController");

userRoutes
  .route("/updatePassword")
  .patch(authController.protect, userController.updatePassword);

userRoutes
  .route("/updateSelf")
  .patch(authController.protect, userController.updateSelf);

userRoutes
  .route("/deleteSelf")
  .delete(authController.protect, userController.deleteSelf);

userRoutes
  .route("/getAllUser")
  .get(authController.protect, userController.getAllUser);

module.exports = userRoutes;
