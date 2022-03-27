const path  = require('path');
const multer = require("multer");
const CompressPDF = require("../utils/classes/compressPDF");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext.matchAll(/^.*\.(|doc|docx|pdf|ppt|pptx)$/g)) {
    cb(null, file);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadFiles = upload.array('files', 10);

// exports.save = async (req, res, next) => {
//   console.log("File saving ......");
//   const {userId} = req.session;
//   await new DocSave(userId, req.files).saveToDB(req.files);
//   next();
// }

exports.compress = async(req, res, next) => {
  console.log("File compressing ......");
  await CompressPDF.compress(req.files);

  res.status(200).json({
    status: "success",
    message: "PDF compressed"
  });
}
