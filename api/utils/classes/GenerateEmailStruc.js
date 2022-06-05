module.exports = class GenerateEmailStruc {
  constructor() {
    this.generateStruc();
  }

  generateStruc() {
    this.struct = {
      url: null,
      to: null,
      from: "superpdf@noreply.org.in",
      message: null,
    };
  }

  get structure() {
    if (this.struct) return this.struct;
  }
};
