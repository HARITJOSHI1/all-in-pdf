const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const Documents = require("../../models/Document");
const Users = require("../../models/Users");
const ServiceError = require("./ServiceError");

const unlink = promisify(fs.unlink);

module.exports = class Cleaner {
  static async cleanFromDB(id) {
    try {
      await Documents.deleteMany({ userId: id });
      return true;
    } catch (err) {
      throw new ServiceError(err);
    }
  }

  static async cleanFromFS(file) {
    try {
      const pathToFile = path.resolve(__dirname, `../../data/${file}.zip`);
      await unlink(pathToFile);
      return true;
    } catch (err) {
      throw new ServiceError(err);
    }
  }

  static async cleanTempUser(id) {
    try {
      await Users.findByIdAndDelete(id);
      return true;
    } catch (err) {
      throw new ServiceError(err);
    }
  }
};
