const express = require("express");
const Router = express.Router();
const {
  uploadFiles,
  compress,
  wordToPDF,
  encrypt,
  merge,
  rotate
} = require("../controllers/fileController");

const {scheduleDelete} = require("../utils/deleteUnusedFiles");
const {verifyJWT} = require("../controllers/authController");

Router.use(uploadFiles);

Router.post("/compress", compress);
Router.post("/encrypt", encrypt);
Router.post("/merge", merge);
Router.post("/rotate", rotate);
Router.post("/word-to-pdf", uploadFiles, wordToPDF);

Router.use(scheduleDelete);

module.exports = Router;
