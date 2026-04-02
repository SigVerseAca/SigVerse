/**
 * COURSE CONTROLLER - Member 3 Content Management
 * 
 * Handles course CRUD operations with role-based workflows.
 * Uses req.user from Member 1's authenticate middleware to:
 * - req.user.sub: User ID for ownership and identity
 * - req.user.role: Role ('instructor', 'admin', 'learner') to determine workflow
 * 
 * Workflow:
 * - Instructors: Create/update/delete courses via approval requests (202 Accepted)
 * - Admin: Create/update/delete courses directly (201/200 OK)
 * - Learners: View courses only (via getAll/getById)
 */
const CourseService = require('../services/CourseService');
const ApprovalService = require('../services/ApprovalService');
const InstructorScopeService = require('../services/InstructorScopeService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Create Course
 * POST /api/courses
 * - Instructors: Submits approval request (202 Accepted)
 * - Admins: Creates course directly (201 Created)
 * Uses req.user.sub as requester_id and instructor_id from Member 1 auth
 */
exports.create = async (req, res, next) => {
  try {
    // Check user role from Member 1 authenticate middleware
    if (req.user.role === 'instructor') {
      // Instructors submit course creation for admin approval
      const data = await ApprovalService.createRequest({
        requester_id: req.user.sub, // From authenticate middleware
        request_type: 'course',
        action: 'create',
        payload: { ...req.body, instructor_id: req.user.sub }
      });
      return sendSuccess(res, 202, data, 'Course creation request submitted for admin approval');
    }

    // Admins can create directly
    const data = await CourseService.create(req.body);
    sendSuccess(res, 201, data, 'Course created');
  } catch (err) { next(err); }
};

/**
 * Get All Courses
 * GET /api/courses
 * Requires authentication (any role via Member 1 authenticate)
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await CourseService.getAll();
    sendSuccess(res, 200, data);
  } catch (err) { next(err); }
};

/**
 * Get Course by ID
 * GET /api/courses/:id
 * Requires authentication (any role via Member 1 authenticate)
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await CourseService.getById(req.params.id);
    if (!data) return sendError(res, 404, 'Course not found');
    sendSuccess(res, 200, data);
  } catch (err) { next(err); }
};

/**
 * Update Course
 * PUT /api/courses/:id
 * - Instructors: Submits approval request after ownership check (202 Accepted)
 * - Admins: Updates course directly (200 OK)
 * Uses req.user.sub for instructor ownership verification
 */
exports.update = async (req, res, next) => {
  try {
    // Check user role from Member 1 authenticate middleware
    if (req.user.role === 'instructor') {
      // Verify instructor owns this course using req.user.sub
      await InstructorScopeService.assertCourseOwnership(req.user.sub, Number(req.params.id));
      // Submit update for approval
      const data = await ApprovalService.createRequest({
        requester_id: req.user.sub, // From authenticate middleware
        request_type: 'course',
        action: 'update',
        entity_id: Number(req.params.id),
        payload: { ...req.body, instructor_id: req.user.sub }
      });
      return sendSuccess(res, 202, data, 'Course update request submitted for admin approval');
    }

    // Admins can update directly
    const data = await CourseService.update(req.params.id, req.body);
    sendSuccess(res, 200, data, 'Course updated');
  } catch (err) { next(err); }
};

/**
 * Partial Update Course
 * PATCH /api/courses/:id
 * - Instructors: Submits partial update approval request (202 Accepted)
 * - Admins: Updates course directly (200 OK)
 */
exports.patch = async (req, res, next) => {
  try {
    // Check user role from Member 1 authenticate middleware
    if (req.user.role === 'instructor') {
      // Verify instructor owns this course using req.user.sub
      await InstructorScopeService.assertCourseOwnership(req.user.sub, Number(req.params.id));
      // Submit partial update for approval
      const data = await ApprovalService.createRequest({
        requester_id: req.user.sub, // From authenticate middleware
        request_type: 'course',
        action: 'update',
        entity_id: Number(req.params.id),
        payload: req.body
      });
      return sendSuccess(res, 202, data, 'Course update request submitted for admin approval');
    }

    // Admins can patch directly
    const data = await CourseService.patch(req.params.id, req.body);
    sendSuccess(res, 200, data, 'Course updated');
  } catch (err) { next(err); }
};

/**
 * Delete Course
 * DELETE /api/courses/:id
 * - Instructors: Submits deletion approval request (202 Accepted)
 * - Admins: Deletes course directly (200 OK)
 */
exports.remove = async (req, res, next) => {
  try {
    // Check user role from Member 1 authenticate middleware
    if (req.user.role === 'instructor') {
      // Verify instructor owns this course using req.user.sub
      await InstructorScopeService.assertCourseOwnership(req.user.sub, Number(req.params.id));
      // Submit deletion for approval
      const data = await ApprovalService.createRequest({
        requester_id: req.user.sub, // From authenticate middleware
        request_type: 'course',
        action: 'delete',
        entity_id: Number(req.params.id),
        payload: {}
      });
      return sendSuccess(res, 202, data, 'Course deletion request submitted for admin approval');
    }

    // Admins can delete directly
    await CourseService.remove(req.params.id);
    sendSuccess(res, 200, null, 'Course deleted');
  } catch (err) { next(err); }
};
