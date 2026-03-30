/**
 * MODULE ROUTES - Member 3 Content Management
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
 * Modules belong to courses and contain lessons
 */
const router = require('express').Router();
const ModuleController = require('../controllers/ModuleController');
// Member 1 provided authentication middleware
const authenticate = require('../middlewares/authenticate');
// Member 1 provided authorization middleware
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const logger = require('../middlewares/logger');
const { moduleCreateSchema, modulePatchSchema } = require('../utils/validators/moduleValidator');

// Create Module: Requires authentication and instructor/admin role
router.post('/', authenticate, authorize('instructor', 'admin'), validate(moduleCreateSchema), logger, ModuleController.create);

// Get All Modules: Requires authentication only
router.get('/', authenticate, logger, ModuleController.getAll);

// Get Module by ID: Requires authentication only
router.get('/:id', authenticate, logger, ModuleController.getById);

// Update Module: Requires authentication and instructor/admin role
router.put('/:id', authenticate, authorize('instructor', 'admin'), validate(moduleCreateSchema), logger, ModuleController.update);

// Partial Update Module: Requires authentication and instructor/admin role
router.patch('/:id', authenticate, authorize('instructor', 'admin'), validate(modulePatchSchema), logger, ModuleController.patch);

// Delete Module: Requires authentication and admin/instructor role
router.delete('/:id', authenticate, authorize('admin', 'instructor'), logger, ModuleController.remove);

module.exports = router;
