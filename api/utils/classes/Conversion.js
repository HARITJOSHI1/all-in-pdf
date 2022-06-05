const { PDFNet } = require("@pdftron/pdfnet-node");
const DocSaver = require("./DocSaver");

class Conversion extends DocSaver {}

exports.WordToPDF = class WordToPDF extends Conversion {
  static files(files) {
    this.prototype.init();
    PDFNet.runWithCleanup(this.prototype.addDocs.bind(this.prototype, files));
  }

  addDocs(files) {
    files.forEach(async (f) => await this.convert(f, files.length));
  }

  async convert(file, total) {
    const arr = [];
    // await pdfDoc.initSecurityHandler();
    // await PDFNet.Convert.toPdfWithBuffer(pdfDoc, file.buffer, "docx");
    const b = file.buffer;
    // let ab = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    const temp = await PDFNet.Convert.office2PDFBuffer(b);
    const pdfDoc = await PDFNet.PDFDoc.createFromBuffer(temp);
    const buf = await pdfDoc.saveMemoryBuffer(
      PDFNet.SDFDoc.SaveOptions.e_linearized
    );
    // const outputPath = path.resolve(__dirname, "../data.pdf");
    // const buf = fs.readFileSync(outputPath);

    const metadata = {
      name: this.fileName.concat(".zip"),
      userId: this.uid,
      type: "pdf",
      buffer: buf,
    };

    this.toSave(arr, metadata);
  }
};
