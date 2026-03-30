const { CourseModel, PerformanceModel, UserModel } = require('./models');

function serializePerformance(performance) {
  if (!performance) return null;

  const plain = performance.get({ plain: true });
  return {
    ...plain,
    user_name: plain.user?.name || null,
    course_title: plain.course?.title || null
  };
}

class Performance {
  static async findAll() {
    const rows = await PerformanceModel.findAll({
      include: [
        { model: UserModel, as: 'user', attributes: ['name'] },
        { model: CourseModel, as: 'course', attributes: ['title'] }
      ]
    });

    return rows.map(serializePerformance);
  }

  static async findById(id) {
    const row = await PerformanceModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'user', attributes: ['name'] },
        { model: CourseModel, as: 'course', attributes: ['title'] }
      ]
    });

    return serializePerformance(row);
  }

  static async findByUserId(userId) {
    const rows = await PerformanceModel.findAll({
      where: { user_id: userId },
      include: [{ model: CourseModel, as: 'course', attributes: ['title'] }]
    });

    return rows.map(serializePerformance);
  }

  static async findByUserAndCourse(userId, courseId) {
    const row = await PerformanceModel.findOne({
      where: { user_id: userId, course_id: courseId },
      include: [{ model: CourseModel, as: 'course', attributes: ['title'] }],
      order: [['completed_at', 'DESC'], ['id', 'DESC']]
    });

    return serializePerformance(row);
  }

  static async create(data) {
    const row = await PerformanceModel.create({
      user_id: data.user_id,
      course_id: data.course_id,
      score: data.score,
      completed_at: new Date()
    });

    return this.findById(row.id);
  }

  static async update(id, data) {
    const row = await PerformanceModel.findByPk(id);
    if (!row) return null;

    await row.update({
      user_id: data.user_id,
      course_id: data.course_id,
      score: data.score,
      completed_at: new Date()
    });

    return this.findById(id);
  }

  static async patch(id, data) {
    const row = await PerformanceModel.findByPk(id);
    if (!row) return null;
    if (!Object.keys(data || {}).length) return this.findById(id);

    await row.update({
      ...data,
      ...(data.score !== undefined ? { completed_at: new Date() } : {})
    });

    return this.findById(id);
  }

  static async upsertByUserAndCourse(data) {
    const existing = await PerformanceModel.findOne({
      where: { user_id: data.user_id, course_id: data.course_id }
    });

    if (existing) {
      await existing.update({
        score: data.score,
        completed_at: new Date()
      });
      return this.findById(existing.id);
    }

    return this.create(data);
  }

  static async delete(id) {
    const deleted = await PerformanceModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = Performance;
