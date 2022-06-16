module.exports = class Response {
  constructor(res, statusCode, status, message = null, data = null) {
    res.status(statusCode).json({
      status,
      message,
      data,
    });
  }
};
