const express = require("express");
const Router = express.Router();
const {
  uploadFiles,
  compress,
  wordToPDF,
  encrypt,
  merge
} = require("../controllers/fileController");


// Router.post('/save', uploadFiles, save);
Router.post("/compress", uploadFiles, compress);
Router.post("/encrypt", uploadFiles, encrypt);
Router.post("/merge", uploadFiles, merge);
Router.post("/word-to-pdf", uploadFiles, wordToPDF);

module.exports = Router;
