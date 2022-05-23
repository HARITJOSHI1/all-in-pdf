const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/classes/AppError");

exports.verifyJWT = catchAsync(async (req, res, next) => {
  const secret = process.env.JWT_SECRET_A;

  jwt.verify(req.cookies.jwt.accessToken, secret, err => {  
    if (err) throw new AppError(500, "Failed to verify the token", `fn verifyJWT(), ${__dirname}`, "JWT");
    
    next();
  });
});
