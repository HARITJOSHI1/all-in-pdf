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

// Router.post('/save', uploadFiles, save);
Router.use(uploadFiles);

Router.post("/compress", compress);
Router.post("/encrypt", encrypt);
Router.post("/merge", merge);

Router.use(scheduleDelete);

// Router.post("/word-to-pdf", uploadFiles, convert);

module.exports = Router;
