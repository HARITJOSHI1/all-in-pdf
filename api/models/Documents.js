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
    required: [true, "Please provide user for the document"],
  },

  files: [FileSchema],
  isCompressed: Boolean,
  isRotated: Boolean,
  compressSize: {
    type: [Number],
    default: undefined
  },

  deletedPages: {
    type: [Number],
    default: undefined
  },

  isEncrypted: Boolean,
  filesMerged: {
    type: Number,
    default: undefined
  },

  password: {
    type: String,
    select: false,
    default: undefined
  }
});

docSchema.pre('save', async function(next){
  if(this.password){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Documents", docSchema);
