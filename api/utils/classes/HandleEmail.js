const GenerateEmailStruc = require("./GenerateEmailStruc");
const Email = require("./Emails");

exports.VerificationEmail = class VerificationEmail extends GenerateEmailStruc {
  constructor(instance, req) {
    super();
    this.instance = instance;
    this.struct = this.structure;
    this.createToken(instance);

    console.log("Verify: " + this.verifyToken);

    this.struct.url = `${req.protocol}://${req.get(
      "host"
    )}:5000/api/v1/users/verify/${this.verifyToken}`;

    this.struct.message =
      "After clicking on submit your given email id will be successfully verified so that we can start sending you notification for any upcomming events.";

    this.struct.greet = "Dear User, ";

    this.struct.caption = "Click here to verify";
  }

  async createToken(instance) {
    this.verifyToken = instance.verifyEmailToken();
    await instance.save({ validateBeforeSave: false });
  }

  async send(recipient) {
    this.struct.to = recipient;
    try {
      await new Email(this.struct).sendVerificationEmail();
    } catch (err) {
      this.instance.verifyEmail = undefined;
      this.instance.verifyEmailExp = undefined;
      await this.instance.save({ validateBeforeSave: false });
      console.log(err);
    }
  }
};