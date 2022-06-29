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
const {verifyJWT} = require("../controllers/authController");

Router.use(uploadFiles);

Router.post("/compress", compress);
Router.post("/encrypt", encrypt);
Router.post("/merge", merge);
// Router.post("/word-to-pdf", uploadFiles, convert);

Router.use(scheduleDelete);

module.exports = Router;
