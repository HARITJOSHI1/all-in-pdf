const { PDFNet } = require("@pdftron/pdfnet-node");
const DocSaver = require("./DocSaver");
const ServiceError = require("./ServiceError");

exports.WordToPDF = class WordToPDF extends DocSaver {
  static async convert(files) {
    await this.prototype.init();

    const metadata = {
      buffer: [],
      files: [],
    };

    const tasks = [];

    files.forEach((f) =>
      tasks.push(PDFNet.runWithCleanup(_convert.bind(this, f)))
    );

    async function _convert(file) {
      try {
        const buff = [];
        const b = file.buffer;

        const temp = await PDFNet.Convert.office2PDFBuffer(b);
        const pdfDoc = await PDFNet.PDFDoc.createFromBuffer(temp);
        const buf = await pdfDoc.saveMemoryBuffer(
          PDFNet.SDFDoc.SaveOptions.e_linearized
        );

        buff.push(buf);

        metadata.files.push({
          originalName: file.originalname,
          size: file.size,
        });

        metadata.buffer = [...metadata.buffer, ...buff];
      } catch (err) {
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
