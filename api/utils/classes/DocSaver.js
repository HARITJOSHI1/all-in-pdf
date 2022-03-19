const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zip = new JSZip();
const Document = require('../../models/Document');

class DocSaver {
  constructor() {
    // const files = fs.readFileSync(`${__dirname}/../hello.txt`);  
    // console.log(files.buffer);
    this.metadata = this.zip(file);
  }

  zip(file) {  
    const folder = zip.folder("folder");
    const allFile = Array.from(file);
    // file = file.toString('utf8', 0, file.length);
    folder.file(`${file.originalname}`, file);
    const type = file.originalname.split('.')[1];
    // allFiles.forEach((f) => {
    //     folder.file(f.name, f)
    // });

   let fileName = crypto.randomBytes(32).toString('hex');
   fileName = `${Date.now()}.${fileName}`;

   const isExists = fs.existsSync(`${__dirname}/../../data`);
   if(!isExists) fs.mkdirSync(`${__dirname}/../../data`);

    folder
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(`${__dirname}/../../data/${fileName}.zip`))
      .on("finish", function () {
        console.log("files.zip written.");
      });

      return {
          name: fileName,
          size: file.size,
          type,
          userId: fileName  
      };
  }

  async saveToDB(){
    const Doc = await Document.create(this.metadata);
    console.log("saved to database");
  }

};

// new BasePDF();
