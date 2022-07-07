const {verifyJWT} = require("../controllers/authController");
const catchAsync = require("./catchAsync");
const Cookies = require("./classes/Cookies");

exports.isAuth = catchAsync(async (req, res, next) => {
    if(!Cookies.getCookie(req, 'jwt')) next();
    else await verifyJWT(req, res, next);
});