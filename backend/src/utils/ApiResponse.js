export function success(res, data = null, message = 'Success', statusCode = 200, meta = undefined) {
  const body = { success: true, message, data };
  if (meta !== undefined) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

export function fail(res, message = 'Error', statusCode = 400, errors = []) {
  return res.status(statusCode).json({ success: false, message, errors });
}

export default { success, created, fail };
