module.exports = class Response {
  constructor(res, statusCode, status, message = null, data = null, ...fields) {
    res.status(statusCode).json({
      status,
      message,
      data,
    });
  }
};
