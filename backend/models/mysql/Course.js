const {
  CourseModel,
  EnrollmentModel,
  LessonModel,
  ModuleModel,
  UserModel
} = require('./models');

async function serializeCourse(course, { includeModules = false } = {}) {
  if (!course) return null;

  const plain = course.get({ plain: true });
  const [moduleCount, learnerCount] = await Promise.all([
    ModuleModel.count({ where: { course_id: plain.id } }),
    EnrollmentModel.count({ where: { course_id: plain.id } })
  ]);

  const lessonCount = includeModules
    ? (plain.modules || []).reduce((sum, moduleItem) => sum + ((moduleItem.lessons || []).length), 0)
    : await LessonModel.count({
      include: [{
        model: ModuleModel,
        as: 'module',
        where: { course_id: plain.id }
      }]
    });

  return {
    ...plain,
    instructor_name: plain.instructor?.name || null,
    module_count: moduleCount,
    lesson_count: lessonCount,
    learner_count: learnerCount,
    instructor: undefined
  };
}

class Course {
  static async findAll() {
    const courses = await CourseModel.findAll({
      include: [{ model: UserModel, as: 'instructor', attributes: ['name'] }],
      order: [['created_at', 'DESC'], ['id', 'DESC']]
    });

    return Promise.all(courses.map((course) => serializeCourse(course)));
  }

  static async findById(id) {
    const course = await CourseModel.findByPk(id, {
      include: [{ model: UserModel, as: 'instructor', attributes: ['name'] }]
    });

    return serializeCourse(course);
  }

  static async findByIdWithModules(id) {
    const course = await CourseModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'instructor', attributes: ['name'] },
        {
          model: ModuleModel,
          as: 'modules',
          include: [{ model: LessonModel, as: 'lessons' }]
        }
      ],
      order: [
        [{ model: ModuleModel, as: 'modules' }, 'sequence_order', 'ASC'],
        [{ model: ModuleModel, as: 'modules' }, { model: LessonModel, as: 'lessons' }, 'id', 'ASC']
      ]
    });

    return serializeCourse(course, { includeModules: true });
  }

  static async create(data) {
    const course = await CourseModel.create({
      title: data.title,
      description: data.description,
      youtube_video_url: data.youtube_video_url || null,
      instructor_id: data.instructor_id
    });

    return this.findById(course.id);
  }

  static async update(id, data) {
    const course = await CourseModel.findByPk(id);
    if (!course) return null;

    await course.update({
      title: data.title,
      description: data.description,
      youtube_video_url: data.youtube_video_url || null,
      instructor_id: data.instructor_id
    });

    return this.findById(id);
  }

  static async patch(id, data) {
    const course = await CourseModel.findByPk(id);
    if (!course) return null;
    if (!Object.keys(data || {}).length) return this.findById(id);

    await course.update(data);
    return this.findById(id);
  }

  static async delete(id) {
    const deleted = await CourseModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = Course;
