const mongoose = require("mongoose");
const Users = require("./Users");

const docSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name of the document"],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },
  
});


module.exports = mongoose.model("Documents", docSchema);
