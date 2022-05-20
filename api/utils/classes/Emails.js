const nodemailer = require("nodemailer");
const pug = require('pug');
const ht = require('html-to-text');

module.exports = class Email {
  constructor({from, to, url, message, greet, caption}) {
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

  async send(template, subject) {

    const html = pug.renderFile(`${__dirname}/../../views/${template}.pug`, {
      url: this.url,
      subject,
      message: this.message,
      caption: this.caption,
      greet: this.greet
    });

    const mailOpt =  {
        from: this.sender,
        to: this.to,
        text: ht.htmlToText(html),
        html,
        subject
    }

    this.transporter().sendMail(mailOpt);
  }

  sendVerificationEmail(){
    this.send('verify', "Verify your Email");
  }
}
