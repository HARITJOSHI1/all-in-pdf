const express = require("express");
const Router = express.Router();
const {getRatings, postRatings} = require("../controllers/ratingController");
const {verifyJWT} = require("../controllers/authController");

Router.use(verifyJWT);
Router.route("/:tool").get(getRatings).post(postRatings);

module.exports = Router;
