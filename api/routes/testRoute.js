const express = require('express');
const Router = express.Router();
const {uploadFiles, save, compress} = require('../controllers/fileController');

// Router.post('/save', uploadFiles, save);
Router.post('/compress', uploadFiles, compress);
module.exports = Router;