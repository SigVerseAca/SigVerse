/**
 * JWT UTILITIES - Member 1 Platform Engineering
 * 
 * Purpose:
 * --------
 * Centralized JWT token generation and verification functions.
 * These utilities support the authentication flow used across the platform,
 * including Member 3's content management routes.
 * 
 * Responsibility:
 * ---------------
 * - Generate signed JWT tokens with user claims (sub, email, role)
 * - Verify token signatures and handle expiration
 * - Ensure consistent token format across AuthService and authenticate middleware
 * 
 * Token Structure:
 * ----------------
 * JWT Claims:
 *   sub:   User ID (subject/subject claim)
 *   email: User email address
 *   role:  User role ('admin', 'instructor', 'learner')
 *   exp:   Expiration timestamp (from JWT_EXPIRES_IN)
 *   iat:   Issued at timestamp
 * 
 * Example decoded token:
 * {
 *   "sub": 5,
 *   "email": "instructor@example.com",
 *   "role": "instructor",
 *   "iat": 1711900000,
 *   "exp": 1712505600
 * }
 * 
 * Member 3 Integration - Content Management Flow:
 * -----------------------------------------------
 * 1. Instructor Login (Member 2 AuthService):
 *    - User submits credentials
 *    - AuthService calls generateToken(user)
 *    - Returns JWT with sub=user.id, role='instructor'
 *    - Client stores token in localStorage
 * 
 * 2. Instructor Creates Course (Member 3 CourseController):
 *    - Client sends: POST /api/courses with "Authorization: Bearer <token>"
 *    - authenticate middleware calls verifyToken() implicitly via jwt.verify
 *    - If valid, req.user = { sub: 5, email: "...", role: "instructor" }
 *    - authorize middleware checks role is 'instructor' -> passes
 *    - CourseController.create uses req.user.sub as instructor_id
 * 
 * 3. Learner Enrolls in Course (Member 3 EnrollmentController):
 *    - Similar flow, but authorize allows 'learner' role
 *    - EnrollmentService creates enrollment with learner_id from req.user.sub
 * 
 * Environment Configuration:
 * --------------------------
 * JWT_SECRET:        Secret key for signing/verifying tokens
 *                    MUST be identical in AuthService and authenticate middleware
 *                    Change = all tokens become invalid
 * JWT_EXPIRES_IN:    Token lifetime (default: '7d')
 *                    Can be '24h', '7d', '30d' (any valid JWT exp format)
 *                    Used in generateToken to set expiration
 * 
 * Token Lifecycle:
 * ----------------
 * 1. generateToken() - Creates signed token with expiration
 * 2. Client stores token in Authorization header
 * 3. authenticate middleware uses jwt.verify() to validate
 * 4. On expiration, authenticate returns "Invalid or expired token" (401)
 * 5. Frontend catches 401 and redirects to login
 * 
 * Security Considerations:
 * ------------------------
 * - JWT_SECRET must be strong and kept secret
 * - Tokens should be stored securely (httpOnly cookies preferred)
 * - No sensitive data in token payload - it's only base64 encoded, not encrypted
 * - Token expiration enforced by authentication middleware
 * - All routes using Member 3 endpoints must use authenticate middleware
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a user
 * 
 * @param {object} user - User object with id, email, role properties
 * @returns {string} Signed JWT token
 * 
 * Example:
 * const user = { id: 5, email: "instructor@example.com", role: "instructor" };
 * const token = generateToken(user);
 * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
exports.generateToken = (user) => {
  // Create JWT with user claims: sub (ID), email, role
  // Sign with JWT_SECRET and set expiration from environment
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify a JWT token and return decoded claims
 * 
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token claims { sub, email, role, iat, exp }
 * @throws {Error} If token is invalid, expired, or signature verification fails
 * 
 * Example:
 * const decoded = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
 * console.log(decoded.sub); // 5 (user ID)
 * console.log(decoded.role); // "instructor"
 * 
 * Used by authenticate middleware to populate req.user:
 * const decoded = jwt.verify(token, secret);
 * req.user = decoded;
 */
exports.verifyToken = (token) => {
  // Verify token signature and check expiration using JWT_SECRET
  return jwt.verify(token, process.env.JWT_SECRET);
};
