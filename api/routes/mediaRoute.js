const express = require("express");
const Router = express.Router();
const {shareMediaByEmail} = require("../controllers/mediaController");
const {isAvalToShare} = require("../controllers/authController");

Router.post("/email", isAvalToShare, shareMediaByEmail);
// For whatsapp

module.exports = Router;