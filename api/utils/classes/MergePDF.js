const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");
const ServiceError = require("./ServiceError");

module.exports = class MergePDF extends DocSaver {
  static async merge(files) {
    await this.prototype.init();
    const Doc = await PDFNet.PDFDoc.create();
    Doc.initSecurityHandler();
    return new MergePDF(files, Doc);
  }

  constructor(files, Doc) {
    super();
    this.newDoc = Doc;
    this.count = files.length;
    this.arr = [];
    PDFNet.runWithCleanup(this._merge.bind(this, files, files.length));
  }

  async _merge(files, total) {
    try {
      files.forEach(async (file, idx) => {
        const curDoc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
        const srcPg = await curDoc.getPageCount();
        const destPg = await this.newDoc.getPageCount();

        await this.newDoc.insertPages(
          (idx === 0 ? 1 : destPg + 1),
          curDoc,
          1,
          srcPg,
          PDFNet.PDFDoc.InsertFlag.e_none
        );

        this.count -= 1;

        if (idx === 0) {
          this.metadata = {
            name: this.fileName,
            orignalName: "Merge.pdf",
            filesMerged: total,
            userId: this.uid,
          };
        }

        if (this.count === 0) await this._save(this.arr, 1);
      });
    } catch (err) {
      throw new ServiceError(err);
    }
  }

  async _save(arr, total) {
    const buf = await this.newDoc.saveMemoryBuffer(
      PDFNet.SDFDoc.SaveOptions.e_linearized
    );

    this.metadata.buffer = buf;
    this.metadata.size = [Buffer.byteLength(buf)];

    await this.toSave(arr, this.metadata, total);
  }
};
