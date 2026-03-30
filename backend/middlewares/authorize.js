/**
 * AUTHORIZATION MIDDLEWARE - Member 1 Platform Engineering
 * 
 * Purpose:
 * --------
 * This middleware enforces role-based access control (RBAC) on protected routes.
 * It works in conjunction with authenticate.js - MUST run AFTER authentication.
 * 
 * Responsibility:
 * ---------------
 * - Verify that authenticated user.role is in the list of allowedRoles
 * - Reject requests where user doesn't have required role with 403 status
 * - Ensure only authorized users proceed to controllers
 * 
 * How It Works:
 * - Accepts variable number of allowed role names as parameters
 * - Returns middleware function that checks req.user.role
 * - Compares user.role against allowedRoles array
 * - Returns 403 if user role not authorized
 * - Calls next() if user role is authorized
 * 
 * Supported Roles:
 * ----------------
 * 'admin'      - Full system access, can manage all content
 * 'instructor' - Can create/update courses, modules, lessons (Member 3)
 * 'learner'    - Can enroll, submit quizzes, view courses
 * 
 * Usage Pattern in Routes (Member 3 Examples):
 * -------------------------------------------------------
 * In backend/routes/course.routes.js:
 *   router.post('/', authenticate, authorize('instructor', 'admin'), CourseController.create)
 *   router.put('/:id', authenticate, authorize('instructor', 'admin'), CourseController.update)
 * 
 * In backend/routes/enrollment.routes.js:
 *   router.post('/', authenticate, authorize('learner'), EnrollmentController.create)
 * 
 * Member 3 Content Authorization Flow:
 * 1. POST /api/courses - Only 'instructor' or 'admin' allowed
 *    - authenticate extracts user claims from token
 *    - authorize checks if user.role is 'instructor' or 'admin'
 *    - If user is 'learner', returns 403 Forbidden
 *    - If authorized, CourseController.create proceeds
 * 
 * 2. PUT /api/modules/:id - Only 'instructor' or 'admin' allowed
 *    - Same flow as courses
 *    - InstructorScopeService also verifies ownership
 * 
 * 3. PATCH /api/lessons/:id - Only 'instructor' or 'admin' allowed
 *    - Same flow as courses/modules
 * 
 * Error Scenarios:
 * ----------------
 * User does not have required role: "Access denied: insufficient role" (403)
 * This happens when:
 * - A 'learner' tries to POST /api/courses
 * - A 'learner' tries to PUT /api/modules/:id
 * - Non-'admin' tries to DELETE resources
 * 
 * Stack Integration:
 * ------------------
 * Member 1 provides: authenticate.js (extracts user), authorize.js (checks role)
 * Member 3 depends on: Both middlewares to control course/module/lesson access
 * 
 * Always use together:
 *   authenticate  -> req.user = { sub, email, role }
 *   authorize     -> Validates req.user.role against allowed list
 *   Controller    -> Access req.user.sub for ownership checks
 */

const { sendError } = require('../utils/response');

module.exports = (...allowedRoles) => (req, res, next) => {
  // Check if current user's role is in the allowedRoles array
  if (!allowedRoles.includes(req.user.role)) {
    return sendError(res, 403, 'Access denied: insufficient role');
  }
  // User is authorized, proceed to next middleware/controller
  next();
};
