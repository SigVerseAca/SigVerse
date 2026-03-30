const CourseFeedback = require('../models/mysql/CourseFeedback');

class CourseFeedbackRepository {
  static findAll() { return CourseFeedback.findAll(); }
  static findByLearnerAndCourse(learnerId, courseId) { return CourseFeedback.findByLearnerAndCourse(learnerId, courseId); }
  static findByInstructorId(instructorId) { return CourseFeedback.findByInstructorId(instructorId); }
  static upsert(data) { return CourseFeedback.upsert(data); }
}

module.exports = CourseFeedbackRepository;
