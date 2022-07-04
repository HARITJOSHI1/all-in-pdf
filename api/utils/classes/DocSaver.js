const JSZip = require("jszip");
const fs = require("fs");
const crypto = require("crypto");
const { PDFNet } = require("@pdftron/pdfnet-node");
const Document = require("../../models/Document");
const unzipper = require("unzipper");
const zip = new JSZip();

module.exports = class DocSaver {

  constructor() {
    this.fileName = `${crypto.randomBytes(32).toString("hex")}`;
  }

  async init() {
    await PDFNet.initialize(process.env.PDFTRON_INIT);
  }

  static initDoc(userId) {
    this.prototype.uid = userId;
  }

  async toSave(metadata) {
    this.zip(metadata);
    await this.saveToDB(metadata);
  }

  async unzip(path, name, outPath) {
    const zip = fs
      .createReadStream(path)
      .pipe(unzipper.Parse({ forceStream: true }));
    for await (const entry of zip) {
      const fileName = entry.path;
      console.log("Here is filename", fileName);
      if (fileName === name) {
        entry.pipe(fs.createWriteStream(`${outPath}/${fileName}`));
      } else entry.autodrain();
    }
  }

  zip(metadata) {
    const folder = zip.folder("folder");
    metadata.buffer.forEach((buff, idx) =>
      folder.file(metadata.files[idx].originalName, buff)
    );
    const isExists = fs.existsSync(`${__dirname}/../../data`);
    if (!isExists) fs.mkdirSync(`${__dirname}/../../data`);

    folder
      .generateNodeStream({
        type: "nodebuffer",
        streamFiles: true,
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      })
      .pipe(
        fs.createWriteStream(`${__dirname}/../../data/${this.fileName}.zip`)
      )
      .on("finish", function () {
        console.log("files.zip written.");
        zip.remove("folder");
      });
  }

  async saveToDB(metadata) {
    await (
      await Document.create(metadata)
    ).populate({
      path: "Users",
      select: "_id",
    });
    console.log("saved to database");
  }
};
