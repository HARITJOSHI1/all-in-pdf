const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");
const Document = require("../../models/Document");

module.exports = class CompressPDF extends DocSaver {
  init() {
    PDFNet.initialize(
      "demo:1648307499261:7bcd069603000000009fcbc63ad2a1d44a34f3be31cd0a9f8de88f8d87"
    );
  }

  static async compress(files) {
    this.prototype.init();
    PDFNet.runWithCleanup(this.prototype.addDocs.bind(this.prototype, files));
  }

  addDocs(files) {
    files.forEach((f) => this.shrinkPDF(f, files.length));
  }

  async shrinkPDF(file, total) {
    const arr = [];
    const doc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
    await PDFNet.Optimizer.optimize(doc);
    const buf = await doc.saveMemoryBuffer(
      PDFNet.SDFDoc.SaveOptions.e_linearized
    );

    const metadata = {
      originalname: file.originalname,
      buffer: buf,
      size: file.size,
      isCompressed: true,
      compressSize: Buffer.byteLength(buf),
    };

    arr.push(metadata);

    this.arr = [...arr];
    if (this.arr.length === total) {
      this.zip(this.arr);
      this.saveToDB(this.arr);
    }
  }

  addSize(docs){
    let filter = false;
    filter = docs.every(f => f.isCompressed === true);
    if(filter){
        return docs.map(f => f.compressSize);
    }

    return null;
  }

  async saveToDB(docs) {

    const metadata = {
      name: this.fileName.concat(".zip"),
      userId: this.uid,
      isCompressed: true,
      compressSize: this.addSize(docs)
    };

    await (await Document.create(metadata)).populate({
      path: "Users",
      select: "_id",
    });
    
    console.log("saved to database");
  }
};
