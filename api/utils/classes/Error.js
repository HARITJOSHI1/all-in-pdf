const setDevErr = (err) => {
  const devErr = {
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack,
  };
  console.log("Error occured during development", devErr);
};

const setProdErr = (err, req, res, custom) => {
  const prodErr = {
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack
  };

  console.log("Error occured during production", prodErr);

  return res.status(prodErr.statusCode).json({
      status: prodErr.status,
      message: (custom.isSet ? custom.msg : "Something went wrong")
  })
};

module.exports = (err, res, req) => {
  const error = { ...err };
  if (process.env.NODE_ENV === "development") {
    setDevErr(error);
  }
};
