const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const Ratings = require("../models/Ratings");
const Response = require("../utils/Response");
const AppError = require("../utils/classes/AppError");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const address = require("address");

const ObjectId = mongoose.Types.ObjectId;

jwt.verify = promisify(jwt.verify);

async function isAlreadyRated(req, tool) {
  const userIP = address.ip();
  const id = req.uid;
  let res = false;

  if (await Ratings.findOne({ userId: new ObjectId(id),
    tool}) || await Ratings.findOne({userIP, tool})) res = true;

  return res;
}

exports.postRatings = catchAsync(async (req, res, next) => {
  if (await isAlreadyRated(req, req.path.split("/")[1]))
    throw new AppError(401, "Already rated", `fn() postRatings, ${__dirname}`);

  req.body.userId = req.uid;
  req.body.userIP = address.ip();

  const data = await Ratings.create(req.body);
  if (data) new Response(res, 201, "success", "rated");
  else
    throw new AppError(
      500,
      "Something went wrong",
      `fn postRatings(), ${__dirname}`
    );
});

exports.getRatings = catchAsync(async (req, res, next) => {
  // TODO

  
  res.end("Ratings");
});
