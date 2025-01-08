const responseHandler = (res, statusCode, message, data = null, error = null) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 400,
    message,
    data,
    error
  });
}

module.exports = responseHandler
