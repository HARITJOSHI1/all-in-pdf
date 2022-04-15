const { PDFNet } = require("@pdftron/pdfnet-node");
const DocSaver = require("./DocSaver");
const fs = require("fs");
const {resolve} = require("path");

class Security extends DocSaver {
  constructor(doc, uid, role = "user") {
    super();

    this.doc = doc;
    this.userId = uid;
    this.role = role;
    this.isEncrypted = false;
    this.isBio = false;
  }

  async secureInit() {
    this.handler = await PDFNet.SecurityHandler.createDefault();
    return this.handler;
  }

  setSecurityRules(rules) {
    const main = {};
    if (this.role === "owner") {
      main.e_owner = true;
      this.handler.setPermission(
        PDFNet.SecurityHandler.Permission.e_owner,
        true
      );
    } else {
      for (let R in rules) {
        main[R] = rules[R];
        this.handler.setPermission(PDFNet.SecurityHandler.Permission[R], true);
      }
    }

    return this.handler;
  }
}

class Decryption extends Security {
  static async decrypt(path, pass, doc){
    await this.prototype.init();
    return new Decryption(path, pass, doc);
  }

  constructor(path, pass, doc){
    const arr = [];
    super(doc);
    path = resolve(`${__dirname}`, `../../${path}`);
    this.internalDecrypt(path, pass).then((res) => {
      if(!res) throw new Error("Password is wrong");
      else {
        const metadata = {
          name: this.fileName,
          orignalName: this.doc.originalname,
          buffer: this.docBuff,
          isEncrypted: false,
          isBio: this.isBio,
          userId: this.uid,
          type: "pdf"
        };

        this.toSave(arr, metadata, 1);
      }
    });
  }

  async internalDecrypt(path, pass){
    const outPath = resolve(`${__dirname}`, `../../data`);
    await this.unzip(path, this.doc.originalname, outPath);
    this.docBuff = fs.readFileSync(`${outPath}/${this.doc.originalname}`);
    const s_doc = await PDFNet.PDFDoc.createFromBuffer(this.docBuff);
    
    if(await s_doc.initStdSecurityHandler(pass)){
      await s_doc.removeSecurity();
      return true;
    }
    return false;
  }
}

module.exports = class Encryption extends Security {
  static async secure(doc, rules, role, uid) {
    await this.prototype.init();
    return new Encryption(doc, rules, role, uid);
  }

  constructor(doc, rules, role, uid) {
    super(doc, uid, role);
    this.arr = [];

    this.secureInit().then((res) => {
      res = this.setSecurityRules(rules);
      this.handler = res;
    });
  }

  async encryptViaPass(pass) {
    await PDFNet.runWithCleanup(async () => {
      const pdfDoc = await PDFNet.PDFDoc.createFromBuffer(this.doc.buffer);
      await pdfDoc.initSecurityHandler(); // doubt
      // const path = `/data/${this.fileName}.zip`;

      this.handler.changeUserPasswordUString(pass);
      await pdfDoc.setSecurityHandler(this.handler);

      const buf = await pdfDoc.saveMemoryBuffer(
        PDFNet.SDFDoc.SaveOptions.e_linearized
      );

      const metadata = {
        name: this.fileName,
        orignalName: this.doc.originalname,
        buffer: buf,
        isEncrypted: true,
        isBio: this.isBio,
        password: pass,
        userId: this.uid,
        type: "pdf"
      };

      await this.toSave(this.arr, metadata, 1);
    });
  }
};
