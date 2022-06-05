const setDevErr = (err) => {
  const devErr = {
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    method: err.methodName,
    stack: err.stack,
  };
  console.log("Error occured during development", devErr);
};

const setProdErr = (err, req, res) => {
  const prodErr = {
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack,
  };

  console.log("Error occured during production", prodErr);

  return res.status(prodErr.statusCode).json({
    status: prodErr.status,
    message: err.msg ? err.msg : "Something went wrong",
  });
};

module.exports = async (err, res, req, next) => {
  const error = { ...err };
  console.log("Error handling middleware...");

  if (process.env.NODE_ENV === "development") setDevErr(error);
  else setProdErr(error);

  next();
};
