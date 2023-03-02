const { PDFNet } = require("@pdftron/pdfnet-node");

module.exports = class TextExtract {
  static async setup(fileBfr, numPgExtract) {
    async function initialSetup() {
      await PDFNet.initialize(process.env.PDFTRON_INIT);
    }
    async function extract(fileBfr) {
      try {
        let src = "";
        const doc = await PDFNet.PDFDoc.createFromBuffer(fileBfr);
        doc.initSecurityHandler();
        doc.lock();

        const txt = await PDFNet.TextExtractor.create();
        const rect = new PDFNet.Rect(0, 0, 612, 794);
        const itr = await doc.getPageIterator(1);
        let pgNum = 1;

        // Read every page
        for (itr; await itr.hasNext(); itr.next()) {
          const page = await itr.current();
          await txt.begin(page, rect);
          switch(numPgExtract){
            case 1: 
                src = `Page ${pgNum}: \n\n ${await txt.getAsText()} \n\n\n`;
                break;
            default:
              src+= `Page ${pgNum}: \n\n ${await txt.getAsText()} \n\n\n`;
          } pgNum++;
        }

        return {
          text: src,
        }
      } catch (err) {
        console.log("Error occurred during extraction: ", err);
      }
    }

    await initialSetup();
    const result = await PDFNet.runWithCleanup(extract.bind(null, fileBfr));
    await PDFNet.endDeallocateStack();
    return new TextExtract(result);
  }

  constructor(res) {
    this.result = res;
  }
};
