import { fail } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import config from '../config/index.js';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors || {}).map((e) => ({ field: e.path, message: e.message }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value';
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    errors = [{ field, message: `${field} already exists` }];
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (config.nodeEnv !== 'production' && statusCode === 500) {
    console.error(err);
  }

  return fail(res, message, statusCode, errors);
}

export default errorHandler;
