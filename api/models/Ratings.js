const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    tool: String,
    ratings: Number,
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    }
});

module.exports = mongoose.model("Ratings", Schema);