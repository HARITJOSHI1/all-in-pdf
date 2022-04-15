const path = require("path");
const multer = require("multer");
const CompressPDF = require("../utils/classes/compressPDF");
// const { WordToPDF } = require("../utils/classes/Conversion");
const Encryption = require("../utils/classes/Security");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext.matchAll(/^.*\.(|doc|docx|pdf|ppt|pptx)$/g)) {
    cb(null, file);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadFiles = upload.array("files", 10);

exports.compress = async (req, res, next) => {
  console.log("File compressing ......");
  await CompressPDF.compress(req.files);

  res.status(200).json({
    status: "success",
    message: "PDF compressed",
  });
};

// exports.convert = async (req, res, next) => {
//   console.log("File converting ......");
//   WordToPDF.files(req.files);

//   res.status(200).json({
//     status: "success",
//     message: "converted",
//   });
// };

exports.encrypt = async (req, res, next) => {
  console.log("File encrypting ......");

  const rules = {
    e_extract_content: false	
  }

  await (await Encryption.secure(
    req.files[0],
    rules,
    "owner",
    req.session.userId
  )).encryptViaPass(req.password);

  res.status(200).json({
    status: "success",
    message: "encypted",
  });
};
