/**
 * AUTHORIZATION MIDDLEWARE - Member 1
 * Role-based access control (RBAC) that validates req.user.role against allowed roles
 * Must be used AFTER authenticate() middleware in route chains
 * Used by Member 3 content routes to restrict course/module/lesson operations by role
 */
const { sendError } = require('../utils/response');

module.exports = (...allowedRoles) => (req, res, next) => {
  // Verify that authenticated user's role is in the allowedRoles array
  // allowedRoles could be ('instructor', 'admin') or ('learner') etc.
  if (!allowedRoles.includes(req.user.role)) {
    // User does not have required role for this endpoint
    return sendError(res, 403, 'Access denied: insufficient role');
  }
  // User role is authorized, proceed to controller/next middleware
  next();
};
