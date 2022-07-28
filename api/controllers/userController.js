const catchAsync = require("../utils/catchAsync");
const User = require("../models/Users");
const Response = require("../utils/Response");
const AppError = require("../utils/classes/AppError");

exports.me = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if(user) new Response(res, 200, "success", "my-data", user);
  else throw new AppError(404, "User not found", null);
});
