const { CourseModel, ProgressModel, UserModel } = require('./models');

function serializeProgress(progress) {
  if (!progress) return null;

  const plain = progress.get({ plain: true });
  return {
    ...plain,
    user_name: plain.user?.name || null,
    course_title: plain.course?.title || null
  };
}

class Progress {
  static async findAll() {
    const rows = await ProgressModel.findAll({
      include: [
        { model: UserModel, as: 'user', attributes: ['name'] },
        { model: CourseModel, as: 'course', attributes: ['title'] }
      ]
    });

    return rows.map(serializeProgress);
  }

  static async findById(id) {
    const row = await ProgressModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'user', attributes: ['name'] },
        { model: CourseModel, as: 'course', attributes: ['title'] }
      ]
    });

    return serializeProgress(row);
  }

  static async findByUserId(userId) {
    const rows = await ProgressModel.findAll({
      where: { user_id: userId },
      include: [{ model: CourseModel, as: 'course', attributes: ['title'] }]
    });

    return rows.map(serializeProgress);
  }

  static findByUserAndCourse(userId, courseId) {
    return ProgressModel.findOne({
      where: { user_id: userId, course_id: courseId },
      raw: true
    });
  }

  static async create(data) {
    const row = await ProgressModel.create({
      user_id: data.user_id,
      course_id: data.course_id,
      completion_percentage: data.completion_percentage ?? 0
    });

    return this.findById(row.id);
  }

  static async update(id, data) {
    const row = await ProgressModel.findByPk(id);
    if (!row) return null;

    await row.update({
      user_id: data.user_id,
      course_id: data.course_id,
      completion_percentage: data.completion_percentage,
      last_accessed: new Date()
    });

    return this.findById(id);
  }

  static async patch(id, data) {
    const row = await ProgressModel.findByPk(id);
    if (!row) return null;

    await row.update({
      ...data,
      last_accessed: new Date()
    });

    return this.findById(id);
  }

  static async delete(id) {
    const deleted = await ProgressModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = Progress;
