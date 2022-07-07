const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const FileSchema = new mongoose.Schema({
  originalName: String,
  size: Number,
  compressedSize: {
    type: Number,
    default: undefined
  },
  rotateOrientation: {
    type: String,
    default: undefined
  },
  
  deg: {
    type: String,
    default: undefined
  }
});

const docSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name of the document"],
  },

  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },

  files: [FileSchema],
  type: String,
  isCompressed: Boolean,
  isRotated: Boolean,
  compressSize: {
    type: [Number],
    default: undefined
  },
  isEncrypted: Boolean,
  filesMerged: Number,
  password: {
    type: String,
    select: false
  }
});

docSchema.pre('save', async function(next){
  if(this.password){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Documents", docSchema);
