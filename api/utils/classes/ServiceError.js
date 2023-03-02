const AppError = require('./AppError');

module.exports = class ServiceError extends Error {
  constructor(err) {
    super();
    this.statusCode = 500;
    this.status = 'Internal server error';
    this.reason = err.message;
    this.stack = Error.captureStackTrace(this);
    this.generateError(err);
  }

  generateError = (error) => {
    if (error.code) this.handleDuplicateErrorDB(error);
    else if (error.errors) this.handleValidatorErrorDB(error.errors);
    else if (error.expiredAt || this.reason === 'jwt must be provided')
      this.handleJWT();
    else this.message = 'Something went wrong!';
  };

  handleCastErrorDB = (e) => {
    // TODO
    // return new AppError(`Invalid id with value ${e.value}`, 400);
  };

  handleValidatorErrorDB = (e) => {
    console.log("This is the error: ", e);
    if (e.password) this.statusCode = 400;
    this.message = e.message;
  };

  handleDuplicateErrorDB = (error) => {
    console.log(error.message);
    (this.message = `${Object.keys(error.keyValue)[0]} field is duplicate`),
      (this.statusCode = 409);
  };

  handleJWT() {
    (this.message = this.reason), (this.statusCode = 500);
  }
};
