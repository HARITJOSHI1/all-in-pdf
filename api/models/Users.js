const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: "anonymous",
  },

  email: {
    type: String,
    trim: true,
    default: "anonymous@xyz.com",
    validate: [validator.isEmail, "Please enter a valid email address"],
  },

  profilePic: {
    type: String,
    default: "https://www.gravatar.com/avatar/?d=mp",
  },

  phoneNo: {
    type: String,
    trim: true,
    default: undefined,
    // validate: [validator.isMobilePhone, "Please enter a valid phone number"],
    select: false
  },

  password: {
    type: String,
    trim: true,
    min: 8,
    max: 14,
    validate: [validator.isStrongPassword, "Please enter a strong password"],
    select: false
  },

  confirmPassword: {
    type: String,
    trim: true,
    min: 8,
    max: 14,
    validate: {
      validator: function (value) {
        return value === this.password;
      },

      message: "Passwords do not match",
    },

    select: false
  },

  type: {
    type: String,
    enum: ["normal", "trial", "premium", "anonymous"],
    default: "anonymous",
  },

  emailVerified: Boolean,
  phoneNoVerified: Boolean,

  createdAt: Date,
  filesWorked: {
    type: Number,
    default: 0,
  },

  filesDownloaded: {
    type: Number,
    default: 0,
  },

  location: String,
  passCreatedAt: Date,
  resetToken: {
    type: String,
    select: false,
  },

  passResetTokenExp: {
    type: Date,
    select: false,
  },

  verifyEmail: {
    type: String,
    select: false,
  },

  verifyEmailExp: {
    type: Date,
    select: false,
  },

  message: {
    type: String,
    trim: true
  },
});

// Encrypt passwords:
userSchema.pre("save", async function (next) {
  // runs if password was actually modified
  if (!this.isModified("password")) return next();
  // Hashing password with cost 12
  this.password = await bcrypt.hash(this.password, 10); // returns promise
  this.passCreatedAt = Date.now() - 1000;

  // Delete passwordComfirm field
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.changedPassword = function (JWTtime) {
  if (this.passCreatedAt) {
    const changedPassTimestamp = parseInt(
      this.passCreatedAt.getTime() / 1000,
      10
    );
    return changedPassTimestamp > JWTtime;
  }
  return false;
};

const saveToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = saveToken(resetToken);
  this.passResetTokenexp = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.verifyEmailToken = function () {
  const VT = crypto.randomBytes(32).toString("hex");
  const token = saveToken(VT);
  this.verifyEmail = token;
  this.verifyEmailExp = Date.now() + 10 * 60 * 1000;
  return VT;
};

module.exports = mongoose.model("Users", userSchema);
