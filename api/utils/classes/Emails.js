const nodemailer = require("nodemailer");
const pug = require("pug");
const ht = require("html-to-text");
const fs = require("fs");
const path = require("path");

module.exports = class Email {
  constructor({ from, to, url, message, greet = null, caption = null }) {
    this.sender = from;
    this.to = to;
    this.url = url;
    this.message = message;
    this.greet = greet;
    this.caption = caption;
  }

  transporter() {
    if (process.env.NODE_ENV !== "production") {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  async send(template, subject, docs = null) {
    let html = "";

    const attachments = docs.map((doc) => {
      return {
        filename: doc.name,
        content: fs.createReadStream(
          path.resolve(__dirname, `../../data/${doc.name}.zip`)
        ),
      };
    });

    if (template) {
      html = pug.renderFile(`${__dirname}/../../views/${template}.pug`, {
        url: this.url,
        subject,
        message: this.message,
        caption: this.caption,
        greet: this.greet,
      });
    }

    const mailOpt = {
      from: this.sender,
      to: this.to,
      text: template ? ht.htmlToText(html) : "",
      html,
      subject,
    };

    if (docs.length) {
      mailOpt.attachments = attachments;
      // mailOpt.text = fs.createReadStream(
      //   path.resolve(__dirname, `../../data/text.txt`)
      // );
    }

    this.transporter().sendMail(mailOpt);
  }

  sendVerificationEmail() {
    this.send("verify", "Verify your Email");
  }

  sendResponseEmail(doc) {
    this.send(null, "Shared document", doc);
  }
};
