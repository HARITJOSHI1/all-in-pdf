const { PDFNet } = require("@pdftron/pdfnet-node");
const DocSaver = require("./DocSaver");
const fs = require("fs");
const { resolve } = require("path");
const ServiceError = require("../classes/ServiceError");

class Security extends DocSaver {
  constructor(doc, rules, role = "user") {
    super();
    this.rules = rules;
    this.doc = doc;
    this.role = role;
    this.isEncrypted = false;
  }

  async secureInit() {
    const handler = await PDFNet.SecurityHandler.createDefault();
    return handler;
  }

  async setSecurityRules(rules, handler) {
    if (this.role === "owner") {
      this.handler.setPermission(
        PDFNet.SecurityHandler.Permission.e_owner,
        true
      );
    } else {
      for (let R in rules)
        await handler.setPermission(
          PDFNet.SecurityHandler.Permission[R],
          rules[R]
        );
    }
  }
}

class Decryption extends Security {
  static async initialize(path, pass, doc) {
    await this.prototype.init();
  }

  constructor(path, pass, doc) {
    super(doc);
    path = resolve(`${__dirname}`, `../../${path}`);
    this._decrypt(path, pass).then((res) => {
      if (!res) throw new ServiceError("Password is wrong");
      else {
        const metadata = {
          name: this.fileName,
          originalName: [this.doc.originalname],
          buffer: this.docBuff,
          size: [Buffer.byteLength(buf)],
          isEncrypted: false,
          userId: this.uid,
        };

        this.results = this.addFiles(metadata.size, metadata.originalName);
        this.toSave(metadata);
      }
    });
  }

  async _decrypt(path, pass) {
    const outPath = resolve(`${__dirname}`, `../../data`);
    await this.unzip(path, this.doc.originalname, outPath);
    this.docBuff = fs.readFileSync(`${outPath}/${this.doc.originalname}`);
    const s_doc = await PDFNet.PDFDoc.createFromBuffer(this.docBuff);

    if (await s_doc.initStdSecurityHandler(pass)) {
      await s_doc.removeSecurity();
      return true;
    }
    return false;
  }
}

module.exports = class Encryption extends Security {
  static async initialize() {
    await this.prototype.init();
  }

  constructor(doc, rules, role) {
    super(doc, rules, role);
    this.secureInit().then((res) => (this.handler = res));
  }

  async encryptViaPass(pass) {
    return await PDFNet.runWithCleanup(async () => {
      try {
        const pdfDoc = await PDFNet.PDFDoc.createFromBuffer(this.doc.buffer);
        await pdfDoc.initSecurityHandler(); // doubt
        // const path = `/data/${this.fileName}.zip`;

        await this.handler.changeUserPasswordUString(pass);
        await this.setSecurityRules(this.rules, this.handler);

        await pdfDoc.setSecurityHandler(this.handler);

        const buf = await pdfDoc.saveMemoryBuffer(
          PDFNet.SDFDoc.SaveOptions.e_linearized
        );

        const metadata = {
          name: this.fileName,
          files: [
            {
              originalName: this.doc.originalname,
              size: Buffer.byteLength(buf),
            },
          ],
          buffer: [buf],
          isEncrypted: true,
          password: pass,
          userId: this.uid,
        };

        this.results = {
          originalName: metadata.originalName,
          size: metadata.size,
        };

        this.isEncrypted = true;
        await this.toSave(metadata);
      } catch (err) {
        new ServiceError(err);
      }
    });
  }
};
