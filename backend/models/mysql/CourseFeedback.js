const { CourseFeedbackModel, CourseModel, UserModel } = require('./models');

function serializeFeedback(feedback) {
  if (!feedback) return null;

  const plain = feedback.get({ plain: true });
  return {
    ...plain,
    course_title: plain.course?.title || null,
    learner_name: plain.learner?.name || null,
    learner_email: plain.learner?.email || null,
    instructor_name: plain.feedbackInstructor?.name || null
  };
}

class CourseFeedback {
  static async findAll() {
    const rows = await CourseFeedbackModel.findAll({
      include: [
        { model: CourseModel, as: 'course', attributes: ['title'] },
        { model: UserModel, as: 'learner', attributes: ['name', 'email'] },
        { model: UserModel, as: 'feedbackInstructor', attributes: ['name'] }
      ],
      order: [['updated_at', 'DESC'], ['id', 'DESC']]
    });

    return rows.map(serializeFeedback);
  }

  static async findByLearnerAndCourse(learnerId, courseId) {
    const row = await CourseFeedbackModel.findOne({
      where: { learner_id: learnerId, course_id: courseId },
      include: [
        { model: CourseModel, as: 'course', attributes: ['title'] },
        { model: UserModel, as: 'learner', attributes: ['name', 'email'] },
        { model: UserModel, as: 'feedbackInstructor', attributes: ['name'] }
      ]
    });

    return serializeFeedback(row);
  }

  static async findByInstructorId(instructorId) {
    const rows = await CourseFeedbackModel.findAll({
      where: { instructor_id: instructorId },
      include: [
        { model: CourseModel, as: 'course', attributes: ['title'] },
        { model: UserModel, as: 'learner', attributes: ['name', 'email'] },
        { model: UserModel, as: 'feedbackInstructor', attributes: ['name'] }
      ],
      order: [['updated_at', 'DESC'], ['id', 'DESC']]
    });

    return rows.map(serializeFeedback);
  }

  static async upsert(data) {
    const existing = await CourseFeedbackModel.findOne({
      where: {
        learner_id: data.learner_id,
        course_id: data.course_id
      }
    });

    if (existing) {
      await existing.update({
        instructor_id: data.instructor_id,
        course_rating: data.course_rating,
        instructor_rating: data.instructor_rating,
        feedback: data.feedback
      });
    } else {
      await CourseFeedbackModel.create(data);
    }

    return this.findByLearnerAndCourse(data.learner_id, data.course_id);
  }
}

module.exports = CourseFeedback;
