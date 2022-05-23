module.exports = class ServiceError extends Error {
  constructor(err) {
    super();
    this.statusCode = err?.statusCode;
    this.reason = err.message;
    this.stack = Error.captureStackTrace(this);

    if (err.code) this.generateErrorDB(err);
  }

  generateErrorDB = (error) => {
    if (String(error.code)) this.handleDuplicateErrorDB(error);
  };

  handleCastErrorDB = (e) => {
    // TODO
    // return new AppError(`Invalid id with value ${e.value}`, 400);
  };

  handleValidatorErrorDB = (e) => {
    // TODO
    // return new AppError(`${e.errors.name.value} field is ambigous`, 400);
  };

  handleDuplicateErrorDB = (error) => {
    console.log("superr");
    this.message = `${Object.keys(error.keyValue)[0]} field is duplicate`,
    this.statusCode = 400;
  };

};
