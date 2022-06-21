const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/classes/AppError");
const Users = require("../models/Users");
const Cookies = require("../utils/classes/Cookies");

const HasAccount = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) return null;
  return user;
};

exports.verifyJWT = catchAsync(async (req, res, next) => {
  const secret = process.env.JWT_SECRET_A;

  jwt.verify(req.cookies.jwt.accessToken, secret, (err) => {
    if (err)
      throw new AppError(
        500,
        "Failed to verify the token",
        `fn verifyJWT(), ${__dirname}`,
        "JWT"
      );

    next();
  });
});

exports.isAvalToShare = catchAsync(async (req, res, next) => {
  const { from, to, message } = req.body;
  if (!(await HasAccount(from)))
    throw new AppError(404, "User not found", `fn HasAccount(), ${__dirname}`);
  
  req.from = from;
  req.to = to;
  req.message = message;
  req.docData = Cookies.getCookie(req, "docData");

  // console.log("DocData = ", req.docData);
  next();
});
