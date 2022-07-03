const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");
const ServiceError = require("./ServiceError");

module.exports = class RotatePDF extends DocSaver {
  static async rotate(files, type) {
    await this.prototype.init();

    const metadata = {
      buffer: [],
      files: [],
      isRotated: true,
    };

    const tasks = [];

    files.forEach((f) =>
      tasks.push(PDFNet.runWithCleanup(_rotate.bind(this, f, type)))
    );

    async function _rotate(file, type) {
      try {
        const doc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
        const totalPages = await doc.getPageCount();

        for (let i = 1; i <= totalPages; i++) {
            const page = await doc.getPage(i);
            let rotation;

            switch(type){
                case "right":
                    rotation = PDFNet.Page.Rotate.e_90;
                    break;

                case "left":
                    rotation = PDFNet.Page.Rotate.e_270;
                    break;  
            }

            await page.setRotation(rotation);
        }

        const buf = await doc.saveMemoryBuffer(
          PDFNet.SDFDoc.SaveOptions.e_linearized
        );

        const buff = [];
        buff.push(buf);

        metadata.files.push({
          originalName: file.originalname,
          size: file.size,
          orientation: type,
          degreeRotated: (type=== "left"? "270deg" : "90deg")
        });

        metadata.buffer = [...metadata.buffer, ...buff];
      } 
      
      catch (err) {
        throw new ServiceError(err);
      }
    }

    await Promise.all(tasks);
    return new RotatePDF(metadata);
  }

  constructor(metadata) {
    super();
    this.results = metadata.files;
    metadata.name = `${this.fileName}.zip`;
    metadata.userId = this.uid;

    this.toSave(metadata);
  }
};