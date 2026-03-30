/**
 * AUTHENTICATION MIDDLEWARE - Member 1
 * Validates JWT bearer tokens and extracts user claims (sub, email, role) into req.user
 * Used by all protected routes including Member 3 content management endpoints
 */
const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

module.exports = (req, res, next) => {
  // Extract Authorization header and validate Bearer token format
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'No token provided');
  }
  // Extract token from "Bearer <token>" format
  const token = authHeader.split(' ')[1];
  try {
    // Verify token signature using JWT_SECRET and decode claims
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Populate req.user for downstream middleware/controllers
    // Contains: { sub (user ID), email, role }
    req.user = decoded; // { sub, email, role }
    next();
  } catch (err) {
    // Token is invalid, expired, or signature verification failed
    return sendError(res, 401, 'Invalid or expired token');
  }
};
