const express = require('express');
const Router = express.Router();
const {uploadFiles, save} = require('../controllers/fileController');

Router.post('/save', uploadFiles, save);
module.exports = Router;