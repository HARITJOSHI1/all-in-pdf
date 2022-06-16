const JSZip = require("jszip");
const fs = require("fs");
const crypto = require("crypto");
const { PDFNet } = require("@pdftron/pdfnet-node");
const Document = require("../../models/Document");
const unzipper = require("unzipper");
const zip = new JSZip();

module.exports = class DocSaver {
  files = [];
  constructor() {
    let fileName = crypto.randomBytes(32).toString("hex");
    this.fileName = `${Date.now()}.${fileName}`;
  }
  async init() {
    await PDFNet.initialize(process.env.PDFTRON_INIT);
  }

  static initDoc(userId) {
    this.prototype.uid = userId;
  }

  async toSave(arr, metadata, total) {
    arr.push(metadata);
    if (arr.length === total) {
      arr.forEach(doc => this.files.push({name: doc.name}));
      this.zip(arr);
      await this.saveToDB(metadata);
    }
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

  zip(files) {
    const folder = zip.folder("folder");
    files.forEach((f) =>
      folder.file(
        f.orignalName,
        f.buffer
      )
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
    const doc = await (
      await Document.create(metadata)
    ).populate({
      path: "Users",
      select: "_id",
    });
    console.log("saved to database");
  }
};
