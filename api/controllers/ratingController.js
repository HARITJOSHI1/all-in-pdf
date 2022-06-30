const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const Ratings = require("../models/Ratings");
const Response = require("../utils/Response");
const AppError = require("../utils/classes/AppError");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const address = require("address");
const { log } = require("console");

const ObjectId = mongoose.Types.ObjectId;

jwt.verify = promisify(jwt.verify);

async function isAlreadyRated(req, tool) {
  const userIP = address.ip();
  const id = req.uid;
  let res = false;

  if (
    (await Ratings.findOne({ userId: new ObjectId(id), tool })) ||
    (await Ratings.findOne({ userIP, tool }))
  )
    res = true;

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
  const rateByUser = req.query.rate;
  const tool = req.query.tool;

  const stats = await Ratings.aggregate([
    {
      $group: {
        _id: {
          tool: "$tool",
          ratings: "$rating",
        },

        total: { $sum: 1 },
      },
    },

    {
      $group: {
        _id: {
          tool: "$_id.tool",
        },

        tool: {
          $first: "$_id.tool",
        },

        ratingsData: {
          $addToSet: { ratings: "$_id.ratings", total: "$total" },
        },

        toolUsedBy: { $sum: 1 },
      },
    },

    {
      $unset: ["_id"],
    },
  ]);

  const finalData = stats.filter((d) => (d.tool === tool));
  new Response(res, 200, "success", undefined, finalData);
});
