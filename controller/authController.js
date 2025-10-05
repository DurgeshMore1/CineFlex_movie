const userModel = require("../Models/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CustomeError = require("../CustomeError");
const utils = require("util");
const email = require("../utilities/email");
const crypto = require("crypto");

const token = (id) => {
  return jwt.sign({ id: id }, process.env.SECRETE_STRING, {
    expiresIn: process.env.EXPIRE_TIME,
  });
};

const signIn = async (req, resp) => {
  try {
    const newUser = await userModel.create(req.body);
    let signIntoken = token(newUser._id);
    resp.status(200).json({
      status: "success",
      token: signIntoken,
      data: newUser,
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: exception.message,
    });
  }
};

const login = async (req, resp, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      let err = new CustomeError(
        "Please provide email and password fro login",
        400
      );
      return next(err);
    }

    let user = await userModel.findOne({ email: email }).select("+password");

    if (!(await bcrypt.compare(password, user.password))) {
      let err = new CustomeError(
        "Please provide valid username or password..!",
        400
      );
      return next(err);
    }

    let loginToken = token(user._id);

    resp.status(200).json({
      status: "success",
      token: loginToken,
      data: user,
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: exception.message,
    });
  }
};

const protect = async (req, resp, next) => {
  try {
    const autherizationHeader = req.headers.authorization;
    let token;
    if (autherizationHeader && autherizationHeader.startsWith("Bearer")) {
      token = autherizationHeader.split(" ")[1];
    }

    if (!token) {
      const err = new CustomeError("you are not logged in", 400);
      next(err);
    }

    let decodeToken = await utils.promisify(jwt.verify)(
      token,
      process.env.SECRETE_STRING
    );
    let user = await userModel.findById(decodeToken.id);
    if (!user) {
      const err = new CustomeError("user is not found", 400);
      next(err);
    }
    req.user = user;
    next();
  } catch (exception) {
    next(exception.message, 500);
  }
};

const restrict = (...role) => {
  return (req, resp, next) => {
    if (!role.includes(req.user.role)) {
      let err = new CustomeError("You dont have permission", 403);
      next(err);
    }
    next();
  };
};

const forgatePassword = async (req, resp, next) => {
  let user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    let err = new CustomeError("The user is not found", 400);
    next(err);
  }

  let resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetPassword/${resetToken}`;

  const message = `We have received a password reset request. please use the below link to reset your password \n\n${resetUrl}`;

  try {
    await email.sendEMail({
      email: user.email,
      subject: "Password changed request received",
      message: message,
    });

    resp.status(200).json({
      result: "success",
      message: "The mail send succesfully",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.save({ validateBeforeSave: false });

    return next(new CustomeError(err.message, 500));
  }
};

const resetpassword = async (req, resp, next) => {
  const token1 = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  let user = await userModel.findOne({
    passwordResetToken: token1,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  user.password = req.body.password;
  user.conformPassword = req.body.conformPassword;

  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  user.passwordChangedDate = Date.now();

  user.save();
  const jwtToken = token(user._id);
  resp.status(200).json({
    result: "success",
    token: jwtToken,
  });
};

module.exports = {
  signIn,
  login,
  protect,
  restrict,
  forgatePassword,
  resetpassword,
  token,
};
