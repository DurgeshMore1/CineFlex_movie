const userModel = require("../Models/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CustomeError = require("../CustomeError");
const utils = require("util");
const email = require("../utilities/email");
const crypto = require("crypto");
let authControler = require("../controller/authController");

const updatePassword = async (req, resp, next) => {
  try {
    let user = await userModel.findById(req.user._id).select("+password");
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return next(
        new CustomeError(
          "the current password is not correct,Please provide currect password..",
          500
        )
      );
    }

    user.password = req.body.password;
    user.conformPassword = req.body.conformPassword;

    user.save();

    const updatePasswordToken = authControler.token(user._id);

    resp.status(200).json({
      resul: "success",
      token: updatePasswordToken,
    });
  } catch (exception) {
    resp.status(400).json({
      resul: "fail",
      message: exception.message,
    });
  }
};

let filterObject = (object, ...allowedField) => {
  let newObj = {};
  Object.keys(object).forEach((prop) => {
    if (allowedField.includes(prop)) {
      newObj[prop] = object[prop];
    }
  });

  return newObj;
};

const updateSelf = async (req, resp, next) => {
  if (req.body.password || req.body.conformPassword) {
    return next(
      new CustomeError(
        "The requested end point in not correct , please correct body",
        500
      )
    );
  }

  let newObj = filterObject(req.body, "email", "name", "photo");

  try {
    let updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      newObj,
      { runValidators: true },
      { new: true }
    );

    resp.status(200).json({
      resul: "success",
      data: updatedUser,
    });
  } catch (exception) {
    resp.status(400).json({
      resul: "fail",
      message: exception.message,
    });
  }
};

const deleteSelf = async (req, resp, next) => {
  try {
    let user = await userModel.findByIdAndUpdate(
      req.user._id,
      { active: false },
      { new: true }
    );

    resp.status(200).json({
      resul: "success",
      data: user,
    });
  } catch (exception) {
    resp.status(400).json({
      resul: "fail",
      message: exception.message,
    });
  }
};

const getAllUser = async (req, resp, next) => {
  try {
    let users = await userModel.find();
    resp.status(200).json({
      status: "success",
      data: users,
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: exception.message,
    });
  }
};

module.exports = {
  updatePassword,
  updateSelf,
  deleteSelf,
  getAllUser,
};
