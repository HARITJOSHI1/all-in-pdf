const nodemailer = require("nodemailer");
const pug = require("pug");
const ht = require("html-to-text");
const fs = require("fs");
const path = require("path");

module.exports = class Email {
  constructor({ from, to, url = null, message = null, greet = null, caption = null }) {
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
    let attachments;

    if (docs) {
      attachments = docs.map((doc) => {
        return {
          filename: `${doc.name}.zip`,
          content: fs.createReadStream(
            path.resolve(__dirname, `../../data/${doc.name}.zip`)
          ),
        };
      });
    }

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
      text: template ? ht.htmlToText(html) : this.message,
      html,
      subject,
    };

    if (docs && docs.length) mailOpt.attachments = attachments;

    this.transporter().sendMail(mailOpt);
  }

  async sendWelcomeEmail(){
    await this.send("welcome", "Welcome to one stop pdf solution");
  }

  async sendVerificationEmail() {
    await this.send("verify", "Verify your Email");
  }

  async sendResponseEmail(doc) {
    await this.send(null, "Shared document", doc);
  }
};
