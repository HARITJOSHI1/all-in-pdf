const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    tool: String,
    ratings: Number
});

module.exports = mongoose.model("Ratings", Schema);