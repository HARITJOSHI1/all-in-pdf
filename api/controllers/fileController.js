const path = require("path");
const multer = require("multer");
const CompressPDF = require("../utils/classes/compressPDF");
// const { WordToPDF } = require("../utils/classes/Conversion");
const catchAsync = require("../utils/catchAsync");
const Encryption = require("../utils/classes/Security");
const AppError = require("../utils/classes/AppError");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext.matchAll(/^.*\.(|doc|docx|pdf|ppt|pptx)$/g)) {
    cb(null, file);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadFiles = upload.array("files", 10);

exports.compress = catchAsync(async (req, res, next) => {
  console.log("File compressing ......");
  const file = await CompressPDF.compress(req.files);

  if(!file) throw new AppError(500, "Failed to compress", ` fn upload(),  ${__filename}`);

  res.status(200).json({
    status: "success",
    message: "PDF compressed",
  });
});

// exports.convert = async (req, res, next) => {
//   console.log("File converting ......");
//   WordToPDF.files(req.files);

//   res.status(200).json({
//     status: "success",
//     message: "converted",
//   });
// };

exports.encrypt = catchAsync(async (req, res, next) => {
  console.log("File encrypting ......");

  const rules = {
    e_extract_content: false	
  }

  const file = await (await Encryption.secure(
    req.files[0],
    rules,
    "owner",
    req.session.userId
  )).encryptViaPass(req.password);

  if(!file) throw new AppError(500, "Failed to compress", ` fn upload(),  ${__filename}`);

  res.status(200).json({
    status: "success",
    message: "encypted",
  });
});
