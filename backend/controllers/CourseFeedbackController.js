const CourseFeedbackService = require('../services/CourseFeedbackService');
const { sendSuccess } = require('../utils/response');

exports.upsert = async (req, res, next) => {
  try {
    const data = await CourseFeedbackService.upsertForLearner(req.user.sub, req.body);
    sendSuccess(res, 200, data, 'Feedback saved');
  } catch (err) { next(err); }
};

exports.getMyCourseFeedback = async (req, res, next) => {
  try {
    const data = await CourseFeedbackService.getLearnerCourseFeedback(req.user.sub, Number(req.params.courseId));
    sendSuccess(res, 200, data);
  } catch (err) { next(err); }
};

exports.getInstructorFeedback = async (req, res, next) => {
  try {
    const data = await CourseFeedbackService.getInstructorFeedback(req.user.sub, req.query.course_id);
    sendSuccess(res, 200, data);
  } catch (err) { next(err); }
};
