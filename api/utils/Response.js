module.exports = class Response {
  constructor(res, statusCode, status, message = undefined, data = undefined, ...fields) {
    res.status(statusCode).json({
      status,
      message,
      data,
    });
  }
};
