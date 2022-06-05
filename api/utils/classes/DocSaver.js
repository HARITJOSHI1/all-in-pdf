const JSZip = require("jszip");
const fs = require("fs");
const crypto = require("crypto");
const zip = new JSZip();

module.exports = class DocSaver {
  static initDoc(userId) {
    this.prototype.uid = userId;
  }

  zip(files) {
    const folder = zip.folder("folder");
    files.forEach((f) => folder.file(f.originalname, f.buffer));

    let fileName = crypto.randomBytes(32).toString("hex");
    this.fileName = `${Date.now()}.${fileName}`;

    const isExists = fs.existsSync(`${__dirname}/../../data`);
    if (!isExists) fs.mkdirSync(`${__dirname}/../../data`);

    folder
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(`${__dirname}/../../data/${this.fileName}.zip`))
      .on("finish", function () {
        console.log("files.zip written.");
      });
  }
}
