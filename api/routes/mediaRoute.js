const express = require("express");
const Router = express.Router();
const {shareMediaByEmail, download} = require("../controllers/mediaController");
const {isAvalToShare} = require("../controllers/authController");

Router.post("/email", isAvalToShare, shareMediaByEmail);
Router.get('/download', download);
// For whatsapp

module.exports = Router;