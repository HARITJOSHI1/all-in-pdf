const express = require("express");
const Router = express.Router();
const {
  uploadFiles,
  compress,
  convert,
  encrypt,
} = require("../controllers/fileController");

// Router.post('/save', uploadFiles, save);
Router.post("/compress", uploadFiles, compress);
// Router.post("/word-to-pdf", uploadFiles, convert);
Router.post("/encrypt", uploadFiles, encrypt);

module.exports = Router;
