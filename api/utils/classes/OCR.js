const DocSaver = require("./DocSaver");
const { PDFNet } = require("@pdftron/pdfnet-node");
const ServiceError = require("./ServiceError");
const path = require('path');

module.exports = class OCR extends DocSaver {
  static async start(file, lang = 'eng') {
    await this.prototype.init();
    const metadata = {
      buffer: [],
      files: [],
    };

    const tasks = [];
    tasks.push(
      PDFNet.runWithCleanup(_extract.bind(this, file))
    );

    async function _extract(file) {
      try {

        await PDFNet.addResourceSearchPath(path.resolve(__dirname, '../../lib/Lib'));
        const useIRIS = await PDFNet.OCRModule.isIRISModuleAvailable();
        
        if (!(await PDFNet.OCRModule.isModuleAvailable())) {
            console.log('\nUnable to run OCRTest: PDFTron SDK OCR module not available.');
            console.log('---------------------------------------------------------------');
            console.log('The OCR module is an optional add-on, available for download');
            console.log('at http://www.pdftron.com/. If you have already downloaded this');
            console.log('module, ensure that the SDK is able to find the required files');
            console.log('using the PDFNet.addResourceSearchPath() function.\n');
  
            throw new ServiceError();
        }

        const doc = await PDFNet.PDFDoc.createFromBuffer(file.buffer);
        await doc.initSecurityHandler();
        const opts = new PDFNet.OCRModule.OCROptions();

        setLanguage(useIRIS, opts);
        await PDFNet.OCRModule.processPDF(doc, opts);

        const buf = await doc.saveMemoryBuffer(
          PDFNet.SDFDoc.SaveOptions.e_linearized
        );

        const buff = [];
        buff.push(buf);

        metadata.files.push({
          originalName: file.originalname,
          size: file.size,
        });

        metadata.buffer = [...metadata.buffer, ...buff];
      } catch (err) {
        console.log(err);
        throw new ServiceError(err);
      }
    }

    function setLanguage(useIRIS, opts) {
      if (useIRIS) opts.setOCREngine("iris");

      // move traineddata file to ../lib/Lib folder
      opts.addLang('jpn');
      
    }

    await Promise.all(tasks);
    return new TextExtractor(metadata);
  }

  constructor(metadata) {
    super();
    this.results = metadata.files;
    metadata.name = `${this.fileName}.zip`;
    metadata.userId = this.uid;
    this.toSave(metadata);
  }
};
