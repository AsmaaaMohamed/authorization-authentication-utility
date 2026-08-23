const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "fail",
    statusCode,
    message: err.message || "Internal Server Error"
  });
};

module.exports = errorHandler;