const multer = require("multer");
const DocSave = require("../utils/classes/DocSaver");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('application')) {
    cb(null, file);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadFiles = upload.array('files', 10);

exports.save = async (req, res, next) => {
  console.log("File saving ......");
  const {userId} = req.session;
  await new DocSave(userId, req.files).saveToDB(req.files);
  next();
}
