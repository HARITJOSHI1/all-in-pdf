const setDevErr = (err, res) => {
  const devErr = {
    statusCode: err.statusCode,
    status: err.status,
    reason: err?.reason,
    message: err.message,
    method: err.methodName,
    stack: err.stack,
  };
  console.log("Error occured during development", devErr);

  return res.status(devErr.statusCode).json({
    status: devErr.status,
    message: devErr.message,
  });
};

const setProdErr = (err, res) => {
  const prodErr = {
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
  };

  console.log("Error occured during production", prodErr);

  return res.status(prodErr.statusCode).json({
    status: prodErr.status,
    message: prodErr.message ? prodErr.message : "Something went wrong",
  });
};

module.exports = async (err, req, res, next) => {
  const error = { ...err };

  if (process.env.NODE_ENV === "development") setDevErr(error, res);
  else setProdErr(error, res);

  next();
};
