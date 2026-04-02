/**
 * LESSON ROUTES - Member 3 Content Management
 * 
 * Integrates with Member 1 authentication/authorization middleware:
 * - authenticate (from Member 1): Validates JWT and populates req.user
 * - authorize (from Member 1): Role-based access control enforcement
 * 
 * Route Access Control:
 * - POST/PUT/PATCH/DELETE: Requires 'instructor' or 'admin' role
 * - GET: Requires authentication (any authenticated role)
 * 
 * Hierarchy: Course -> Module -> Lesson
 * Lessons are the smallest content unit, organized within modules
 */
const router = require('express').Router();
const LessonController = require('../controllers/LessonController');
// Member 1 provided authentication middleware
const authenticate = require('../middlewares/authenticate');
// Member 1 provided authorization middleware
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const logger = require('../middlewares/logger');
const { lessonCreateSchema, lessonPatchSchema } = require('../utils/validators/lessonValidator');

// Create Lesson: Requires authentication and instructor/admin role
router.post('/', authenticate, authorize('instructor', 'admin'), validate(lessonCreateSchema), logger, LessonController.create);

// Get All Lessons: Requires authentication only
router.get('/', authenticate, logger, LessonController.getAll);

// Get Lesson by ID: Requires authentication only
router.get('/:id', authenticate, logger, LessonController.getById);

// Update Lesson: Requires authentication and instructor/admin role
router.put('/:id', authenticate, authorize('instructor', 'admin'), validate(lessonCreateSchema), logger, LessonController.update);

// Partial Update Lesson: Requires authentication and instructor/admin role
router.patch('/:id', authenticate, authorize('instructor', 'admin'), validate(lessonPatchSchema), logger, LessonController.patch);

// Delete Lesson: Requires authentication and admin/instructor role
router.delete('/:id', authenticate, authorize('admin', 'instructor'), logger, LessonController.remove);

module.exports = router;
