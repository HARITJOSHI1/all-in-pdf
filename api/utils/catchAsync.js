const AppError = require("./classes/AppError");
const ServiceError = require("./classes/ServiceError");

module.exports = function catchAsync(fun) {
  return (req, res, next) =>
    fun(req, res, next).catch((err) => {
      next(err);
      // if (!(err instanceof AppError)) next(new ServiceError(err));
      // else if (err instanceof AppError) next(err);
      // else next(err);
    });
};
