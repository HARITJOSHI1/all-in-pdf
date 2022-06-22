const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");
const ServiceError = require("./ServiceError");

module.exports = class CompressPDF extends DocSaver {
  static async compress(files) {
    await this.prototype.init();

    const metadata = {
      buffer: [],
      files: [],
      isCompressed: true,
    };

    const tasks = [];

    files.forEach((f) =>
      tasks.push(PDFNet.runWithCleanup(shrinkPDF.bind(this, f)))
    );

    async function shrinkPDF(file) {
      try {
        const doc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
        await PDFNet.Optimizer.optimize(doc);
        const buf = await doc.saveMemoryBuffer(
          PDFNet.SDFDoc.SaveOptions.e_linearized
        );

        const buff = [];
        buff.push(buf);

        metadata.files.push({
          originalName: file.originalname,
          size: file.size,
          compressedSize: Buffer.byteLength(buf)
        });

        metadata.buffer = [...metadata.buffer, ...buff];
      } 
      
      catch (err) {
        throw new ServiceError(err);
      }
    }

    await Promise.all(tasks);
    return new CompressPDF(metadata);
  }

  constructor(metadata) {
    super();
    this.results = metadata.files;
    metadata.name = `${this.fileName}.zip`;
    metadata.userId = this.uid;

    this.toSave(metadata);
  }
};