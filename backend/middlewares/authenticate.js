/**
 * AUTHENTICATION MIDDLEWARE - Member 1 Platform Engineering
 * 
 * Purpose:
 * --------
 * This middleware validates JWT bearer tokens on incoming requests.
 * It is a core platform requirement that runs FIRST in middleware chains
 * before any role-based authorization (authorize.js) can be applied.
 * 
 * Responsibility:
 * ---------------
 * - Verify that a valid JWT token is provided in the Authorization header
 * - Extract and decode the token using the JWT_SECRET
 * - Populate req.user with decoded token claims (sub, email, role)
 * - Reject requests with missing or invalid tokens with 401 status
 * 
 * How It Works:
 * - Extracts "Authorization: Bearer <token>" header from request
 * - Validates bearer format (must start with "Bearer ")
 * - Verifies token signature using JWT_SECRET from environment
 * - Extracts decoded payload containing { sub, email, role }
 * - Attaches decoded token to req.user for downstream usage
 * - All subsequent middleware (authorize) uses req.user for decisions
 * 
 * Usage in Routes (Member 3 Content Management Example):
 * -------------------------------------------------------
 * In backend/routes/course.routes.js:
 *   router.post('/', authenticate, authorize('instructor', 'admin'), CourseController.create)
 *   router.get('/:id', authenticate, CourseController.getById)
 * 
 * Member 3 Content Flow:
 * - Instructors call POST /api/courses with Bearer token
 * - authenticate middleware validates token, extracts user ID and role
 * - authorize validates that user.role is 'instructor' or 'admin'
 * - CourseController.create uses req.user.sub for instructor_id
 * 
 * The pattern applies to all Member 3 content endpoints:
 * - Course CRUD operations require authenticate first
 * - Module CRUD operations require authenticate first  
 * - Lesson CRUD operations require authenticate first
 * 
 * Error Scenarios:
 * ----------------
 * Missing Token: "No token provided" (401) - Unauthenticated request
 * Invalid Format: "No token provided" (401) - Bearer prefix missing
 * Expired Token: "Invalid or expired token" (401) - Token life exceeded
 * Wrong Secret: "Invalid or expired token" (401) - JWT_SECRET mismatch
 * 
 * Environment Dependencies:
 * -------------------------
 * JWT_SECRET - Must match secret used to sign tokens in AuthService
 * If JWT_SECRET changes, all issued tokens become invalid
 * This is critical for platform startup - verify in config/db files
 */

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub, email, role }
    next();
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};
