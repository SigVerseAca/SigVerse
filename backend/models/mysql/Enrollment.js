const { CourseModel, EnrollmentModel, UserModel } = require('./models');

function serializeEnrollment(enrollment) {
  if (!enrollment) return null;

  const plain = enrollment.get({ plain: true });
  return {
    ...plain,
    user_name: plain.user?.name || null,
    course_title: plain.course?.title || null,
    course_description: plain.course?.description || null
  };
}

class Enrollment {
  static async findAll() {
    const enrollments = await EnrollmentModel.findAll({
      include: [
        { model: UserModel, as: 'user', attributes: ['name'] },
        { model: CourseModel, as: 'course', attributes: ['title'] }
      ]
    });

    return enrollments.map(serializeEnrollment);
  }

  static async findById(id) {
    const enrollment = await EnrollmentModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'user', attributes: ['name'] },
        { model: CourseModel, as: 'course', attributes: ['title'] }
      ]
    });

    return serializeEnrollment(enrollment);
  }

  static async findByUserId(userId) {
    const enrollments = await EnrollmentModel.findAll({
      where: { user_id: userId },
      include: [{ model: CourseModel, as: 'course', attributes: ['title', 'description'] }]
    });

    return enrollments.map(serializeEnrollment);
  }

  static findByUserAndCourse(userId, courseId) {
    return EnrollmentModel.findOne({
      where: { user_id: userId, course_id: courseId },
      raw: true
    });
  }

  static async create(data) {
    const enrollment = await EnrollmentModel.create({
      user_id: data.user_id,
      course_id: data.course_id
    });

    return this.findById(enrollment.id);
  }

  static async update(id, data) {
    const enrollment = await EnrollmentModel.findByPk(id);
    if (!enrollment) return null;

    await enrollment.update({
      user_id: data.user_id,
      course_id: data.course_id,
      status: data.status
    });

    return this.findById(id);
  }

  static async patch(id, data) {
    const enrollment = await EnrollmentModel.findByPk(id);
    if (!enrollment) return null;
    if (!Object.keys(data || {}).length) return this.findById(id);

    await enrollment.update(data);
    return this.findById(id);
  }

  static async delete(id) {
    const deleted = await EnrollmentModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = Enrollment;
