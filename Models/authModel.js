const mongoDB = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");

let userSchema = new mongoDB.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
  },
  email: {
    type: String,
    required: [true, "The email field is required"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "The valid email is required"],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "The password field is required"],
    select: false,
  },
  passwordChangedDate: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  photo: String,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  conformPassword: {
    type: String,
    minlength: 8,
    required: [true, "The conform password field is required"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "The password must be equal",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.conformPassword = undefined;
  next();
});

userSchema.methods.isPasswordChanged = function (tokemTimestamp) {
  const passwordDate = this.passwordChangedDate.getTime() / 1000;

  if (!passwordDate) {
    return passwordDate < tokemTimestamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  let resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});
let userModel = mongoDB.model("User", userSchema);

module.exports = userModel;
