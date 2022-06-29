const {promisify} = require('util');
const catchAsync = require("../utils/catchAsync");
const Ratings = require("../models/Ratings");
const Response = require("../utils/Response");
const AppError = require("../utils/classes/AppError");
const jwt = require("jsonwebtoken");
const Cookies = require("../utils/classes/Cookies");

jwt.verify = promisify(jwt.verify);

function isAlreadyRated(){
    
}

exports.postRatings = catchAsync(async(req, res, next) => {

    const data = await Ratings.create(req.body);
    if(data) new Response(res, 201, "success", "rated");
    else throw new AppError(500, "Something went wrong", `fn postRatings(), ${__dirname}`);
});

exports.getRatings = catchAsync(async(req, res, next) => {
    // TODO
    res.end("Ratings");
});