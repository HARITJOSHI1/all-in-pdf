const express = require("express");
const Router = express.Router();
const {
  uploadFiles,
  compress,
  convert,
  encrypt,
  merge
} = require("../controllers/fileController");

const {scheduleDelete} = require("../utils/deleteUnusedFiles");
const {getRatings, postRatings} = require("../controllers/ratingController");

// Router.post('/save', uploadFiles, save);
Router.use(uploadFiles);

Router.post("/compress", compress);
Router.post("/encrypt", encrypt);
Router.post("/merge", merge);

Router.use(scheduleDelete);

Router.route("/rating-tool").get(getRatings).post(postRatings);

// Router.post("/word-to-pdf", uploadFiles, convert);

module.exports = Router;
