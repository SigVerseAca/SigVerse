const { LessonModel, ModuleModel } = require('./models');

function serializeLesson(lesson) {
  if (!lesson) return null;

  const plain = lesson.get({ plain: true });
  return {
    ...plain,
    module_name: plain.module?.module_name || null
  };
}

class Lesson {
  static async findAll() {
    const lessons = await LessonModel.findAll({
      include: [{ model: ModuleModel, as: 'module', attributes: ['module_name'] }]
    });

    return lessons.map(serializeLesson);
  }

  static async findById(id) {
    const lesson = await LessonModel.findByPk(id, {
      include: [{ model: ModuleModel, as: 'module', attributes: ['module_name'] }]
    });

    return serializeLesson(lesson);
  }

  static findByModuleId(moduleId) {
    return LessonModel.findAll({
      where: { module_id: moduleId },
      order: [['id', 'ASC']],
      raw: true
    });
  }

  static async create(data) {
    const lesson = await LessonModel.create({
      module_id: data.module_id,
      lesson_name: data.lesson_name,
      content: data.content,
      youtube_video_url: data.youtube_video_url || null
    });

    return this.findById(lesson.id);
  }

  static async update(id, data) {
    const lesson = await LessonModel.findByPk(id);
    if (!lesson) return null;

    await lesson.update({
      module_id: data.module_id,
      lesson_name: data.lesson_name,
      content: data.content,
      youtube_video_url: data.youtube_video_url || null
    });

    return this.findById(id);
  }

  static async patch(id, data) {
    const lesson = await LessonModel.findByPk(id);
    if (!lesson) return null;
    if (!Object.keys(data || {}).length) return this.findById(id);

    await lesson.update(data);
    return this.findById(id);
  }

  static async delete(id) {
    const deleted = await LessonModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = Lesson;
