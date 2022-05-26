const AppError = require("./AppError");

module.exports = class ServiceError extends Error {
  constructor(err) {
    super();
    this.statusCode = 500;
    this.status = "Internal server error";
    this.reason = err.message;
    this.stack = Error.captureStackTrace(this);
    this.generateErrorDB(err);
  }

  generateErrorDB = (error) => {
    if (error.code) this.handleDuplicateErrorDB(error);
    else if (error.errors) this.handleValidatorErrorDB(error.errors);
  };

  handleCastErrorDB = (e) => {
    // TODO
    // return new AppError(`Invalid id with value ${e.value}`, 400);
  };

  handleValidatorErrorDB = (e) => {
    if(e.password)
      this.statusCode = 400;
      this.message = "Please enter a strong password";
  };

  handleDuplicateErrorDB = (error) => {
    this.message = `${Object.keys(error.keyValue)[0]} field is duplicate`,
    this.statusCode = 409;
  };

};
