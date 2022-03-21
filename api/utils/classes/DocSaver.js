const JSZip = require("jszip");
const fs = require("fs");
const crypto = require("crypto");
const zip = new JSZip();
const Document = require("../../models/Document");

module.exports = class DocSaver {
  constructor(userId, files) {
    this.uid = userId;
    this.zip(files);
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

  async saveToDB() {
    const metadata = {
      name: this.fileName,
      userId: this.uid,
    };

    await (await Document.create(metadata)).populate({
      path: "Users",
      select: "_id",
    });
    
    console.log("saved to database");
  }
}
