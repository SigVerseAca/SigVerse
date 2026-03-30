const { CourseModel, LessonModel, ModuleModel } = require('./models');

function serializeModule(module) {
  if (!module) return null;

  const plain = module.get({ plain: true });
  return {
    ...plain,
    course_title: plain.course?.title || null,
    lessons: plain.lessons || undefined
  };
}

class Module {
  static async findAll() {
    const modules = await ModuleModel.findAll({
      include: [{ model: CourseModel, as: 'course', attributes: ['title'] }],
      order: [['sequence_order', 'ASC']]
    });

    return modules.map(serializeModule);
  }

  static async findById(id) {
    const moduleItem = await ModuleModel.findByPk(id, {
      include: [{ model: CourseModel, as: 'course', attributes: ['title'] }]
    });

    return serializeModule(moduleItem);
  }

  static async findByIdWithLessons(id) {
    const moduleItem = await ModuleModel.findByPk(id, {
      include: [
        { model: CourseModel, as: 'course', attributes: ['title'] },
        { model: LessonModel, as: 'lessons' }
      ],
      order: [[{ model: LessonModel, as: 'lessons' }, 'id', 'ASC']]
    });

    return serializeModule(moduleItem);
  }

  static findByCourseId(courseId) {
    return ModuleModel.findAll({
      where: { course_id: courseId },
      order: [['sequence_order', 'ASC']],
      raw: true
    });
  }

  static async create(data) {
    const moduleItem = await ModuleModel.create({
      course_id: data.course_id,
      module_name: data.module_name,
      sequence_order: data.sequence_order
    });

    return this.findById(moduleItem.id);
  }

  static async update(id, data) {
    const moduleItem = await ModuleModel.findByPk(id);
    if (!moduleItem) return null;

    await moduleItem.update({
      course_id: data.course_id,
      module_name: data.module_name,
      sequence_order: data.sequence_order
    });

    return this.findById(id);
  }

  static async patch(id, data) {
    const moduleItem = await ModuleModel.findByPk(id);
    if (!moduleItem) return null;
    if (!Object.keys(data || {}).length) return this.findById(id);

    await moduleItem.update(data);
    return this.findById(id);
  }

  static async delete(id) {
    const deleted = await ModuleModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = Module;
