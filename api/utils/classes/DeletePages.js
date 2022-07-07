const DocSaver = require("./DocSaver");
const ServiceError = require("./ServiceError");
const {PDFDocument} = require("pdf-lib");

module.exports = class DeletePages extends DocSaver {
  static async delete(files, pages) {
    await this.prototype.init();
    const metadata = {
      buffer: [],
      files: [],
      deletedPages: [],
    };

    const tasks = [];

    files.forEach((f) =>
      tasks.push(_delete(f, pages))
    );

    async function _delete(file, pages) {
      try {
        const doc = await PDFDocument.load(file.buffer);
        pages.forEach(async (p) => {
            doc.removePage(+p - 1);
            metadata.deletedPages.push(+p);
        });

        const buf = await doc.save();

        const buff = [];
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
    return new DeletePages(metadata);
  }

  constructor(metadata) {
    super();
    this.results = metadata.files;
    metadata.name = `${this.fileName}.zip`;
    metadata.userId = this.uid;

    this.toSave(metadata);
  }
};
