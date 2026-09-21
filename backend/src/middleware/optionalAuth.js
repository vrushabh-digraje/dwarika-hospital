/**
 * Placeholder for future authentication.
 * Currently a no-op that attaches req.user = null.
 * When auth is enabled, verify JWT here and set req.user.
 */
export function optionalAuth(req, res, next) {
  req.user = null;
  next();
}

/**
 * Future protect middleware — currently allows all requests.
 * Swap implementation when JWT auth is added; route wiring stays the same.
 */
export function protect(req, res, next) {
  // if (!config.auth.enabled) return next();
  // verify token...
  next();
}

export default { optionalAuth, protect };
