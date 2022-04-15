const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");

module.exports = class CompressPDF extends DocSaver {
  static async compress(files) {
    await this.prototype.init();
    return new CompressPDF(files);
  }

  constructor(files) {
    super();
    this.arr = [];
    this.compressedSizes = [];
    files.forEach(
      async (f) =>
        await PDFNet.runWithCleanup(this.shrinkPDF.bind(this, f, files.length))
    );
  }

  async shrinkPDF(file, total) {
    const doc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
    await PDFNet.Optimizer.optimize(doc);
    const buf = await doc.saveMemoryBuffer(
      PDFNet.SDFDoc.SaveOptions.e_linearized
    );

    this.compressedSizes.push(Buffer.byteLength(buf));
    const metadata = {
      name: this.fileName,
      orignalName: file.originalname,
      buffer: buf,
      size: file.size,
      isCompressed: true,
      compressSize: [...this.compressedSizes],
      userId: this.uid
    };

    await this.toSave(this.arr, metadata, total);
  }
};
