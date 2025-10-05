module.exports = (error, req, resp, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  resp.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
