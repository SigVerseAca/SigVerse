/**
 * COURSE ROUTES - Member 3 Content Management
 * 
 * Integrates with Member 1 authentication/authorization middleware:
 * - authenticate (from Member 1): Validates JWT and populates req.user
 * - authorize (from Member 1): Role-based access control enforcement
 * 
 * Route Access Control:
 * - POST/PUT/PATCH/DELETE: Requires 'instructor' or 'admin' role
 * - GET: Requires authentication (any authenticated role)
 */
const router = require('express').Router();
const CourseController = require('../controllers/CourseController');
// Member 1 provided authentication middleware
const authenticate = require('../middlewares/authenticate');
// Member 1 provided authorization middleware
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const logger = require('../middlewares/logger');
const { courseCreateSchema, coursePatchSchema } = require('../utils/validators/courseValidator');

// Create Course: Requires authentication and instructor/admin role
router.post('/', authenticate, authorize('instructor', 'admin'), validate(courseCreateSchema), logger, CourseController.create);

// Get All Courses: Requires authentication only
router.get('/', authenticate, logger, CourseController.getAll);

// Get Course by ID: Requires authentication only
router.get('/:id', authenticate, logger, CourseController.getById);

// Update Course: Requires authentication and instructor/admin role
router.put('/:id', authenticate, authorize('instructor', 'admin'), validate(courseCreateSchema), logger, CourseController.update);

// Partial Update Course: Requires authentication and instructor/admin role
router.patch('/:id', authenticate, authorize('instructor', 'admin'), validate(coursePatchSchema), logger, CourseController.patch);

// Delete Course: Requires authentication and admin/instructor role
router.delete('/:id', authenticate, authorize('admin', 'instructor'), logger, CourseController.remove);

module.exports = router;
