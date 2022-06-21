
const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");

module.exports = class CompressPDF extends DocSaver {
  static async compress(files) {
    await this.prototype.init();
    const compressedSizes = [];
    const fileSizes = [];
    const metadata = {
      orignalName: [],
      buffer: [],
      size: [],
      isCompressed: true,
      compressSize: [],
    };

    const tasks = [];

    files.forEach((f) =>
      tasks.push(PDFNet.runWithCleanup(shrinkPDF.bind(this, f)))
    );

    async function shrinkPDF(file) {
      const doc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
      await PDFNet.Optimizer.optimize(doc);
      const buf = await doc.saveMemoryBuffer(
        PDFNet.SDFDoc.SaveOptions.e_linearized
      );

      compressedSizes.push(Buffer.byteLength(buf));
      fileSizes.push(file.size);

      const orig = [];
      const buff = [];
      orig.push(file.originalname);
      buff.push(buf);

      metadata.orignalName = [...metadata.orignalName, ...orig];
      metadata.buffer = [...metadata.buffer, ...buff];
      metadata.size = [...fileSizes];
      metadata.compressSize = [...compressedSizes];
    }

    await Promise.all(tasks);
    return new CompressPDF(metadata, compressedSizes, fileSizes);
  }

  constructor(metadata, compressedSizes, fileSizes) {
    super();
    this.arr = [];
    this.compressedSizes = compressedSizes;
    this.fileSizes = fileSizes;
    metadata.name = `${this.fileName}.zip`;

    this.toSave(metadata);
  }
};





// const DocSaver = require("./DocSaver");
// const { PDFNet } = require("@pdftron/pdfnet-node");

// module.exports = class CompressPDF extends DocSaver {
//   static async compress(files) {
//     await this.prototype.init();
//     return new CompressPDF(files);
//   }

//   constructor(files) {
//     super();
//     this.arr = [];
//     this.compressedSizes = [];
//     this.fileSizes = [];
//     files.forEach(
//       async (f) =>
//         PDFNet.runWithCleanup(this.shrinkPDF.bind(this, f, files.length))
//     );
//   }

//   async shrinkPDF(file, total) {
//     this.fileSizes.push(file.size);
//     const doc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
//     await PDFNet.Optimizer.optimize(doc);
//     const buf = await doc.saveMemoryBuffer(
//       PDFNet.SDFDoc.SaveOptions.e_linearized
//     );

//     this.compressedSizes.push(Buffer.byteLength(buf));
    
//     const metadata = {
//       name: this.fileName,
//       orignalName: file.originalname,
//       buffer: buf,
//       size: [...this.fileSizes],
//       isCompressed: true,
//       compressSize: [...this.compressedSizes],
//       userId: this.uid
//     };

//     await this.toSave(this.arr, metadata, total);
//   }
// };
