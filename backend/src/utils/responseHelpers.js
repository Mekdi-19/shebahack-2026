// Standardized response helpers

exports.success = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.error = (res, message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    message
  };
  if (details) response.details = details;
  return res.status(statusCode).json(response);
};

exports.notFound = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`
  });
};

exports.unauthorized = (res, message = 'Unauthorized access') => {
  return res.status(403).json({
    success: false,
    message
  });
};

exports.validationError = (res, message, hints = null) => {
  const response = {
    success: false,
    message
  };
  if (hints) response.hints = hints;
  return res.status(400).json(response);
};
