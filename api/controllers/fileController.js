const multer = require("multer");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('application/msword') || file.mimetype.startsWith('application/pdf')) {
    cb(null, file);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadFiles = upload.array('files', 10);
