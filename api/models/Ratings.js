const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    tool: String,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users"
    },
    userIP: String
});

module.exports = mongoose.model("Ratings", Schema);