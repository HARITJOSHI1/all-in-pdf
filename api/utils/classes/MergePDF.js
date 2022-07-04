const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");
const ServiceError = require("./ServiceError");

module.exports = class MergePDF extends DocSaver {
  static async merge(files) {
    await this.prototype.init();
    const metadata = {
      buffer: [],
      files: [],
      filesMerged: 0,
    };

    const newDoc = await PDFNet.PDFDoc.create();
    const tasks = [];

    files.forEach((f, idx) =>
      tasks.push(PDFNet.runWithCleanup(_merge.bind(this, f, idx)))
    );

    async function _merge(file, idx) {
      try {
        const curDoc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
        const srcPg = await curDoc.getPageCount();
        const destPg = await newDoc.getPageCount();

        await newDoc.insertPages(
          idx === 0 ? 1 : destPg + 1,
          curDoc,
          1,
          srcPg,
          PDFNet.PDFDoc.InsertFlag.e_none
        );

        metadata.files.push({
          originalName: file.originalname,
          size: file.size,
        });

        metadata.filesMerged = idx + 1;
      } catch (err) {
        throw new ServiceError(err);
      }
    }

    await Promise.all(tasks);
    const buff = await newDoc.saveMemoryBuffer(
      PDFNet.SDFDoc.SaveOptions.e_linearized
    );
    metadata.buffer.push(buff);

    metadata.files.unshift({
      originalName: `merged(${metadata.filesMerged}).pdf`,
      size: Buffer.byteLength(buff),
    });

    return new MergePDF(metadata);
  }

  constructor(metadata) {
    super();
    this.filesMerged = metadata.filesMerged;
    this.results = metadata.files;

    metadata.name = `${this.fileName}.zip`;
    metadata.userId = this.uid;

    this.toSave(metadata);
  }
};
