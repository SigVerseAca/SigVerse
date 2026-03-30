const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.mysql');

const UserModel = sequelize.models.User || sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  role: { type: DataTypes.ENUM('learner', 'instructor', 'admin'), allowNull: false, defaultValue: 'learner' },
  github_id: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  avatar_url: { type: DataTypes.STRING(500), allowNull: true }
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const CourseModel = sequelize.models.Course || sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  youtube_video_url: { type: DataTypes.STRING(500), allowNull: true },
  instructor_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'courses',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const ModuleModel = sequelize.models.Module || sequelize.define('Module', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  module_name: { type: DataTypes.STRING(255), allowNull: false },
  sequence_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  tableName: 'modules',
  underscored: true,
  timestamps: false
});

const LessonModel = sequelize.models.Lesson || sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  module_id: { type: DataTypes.INTEGER, allowNull: false },
  lesson_name: { type: DataTypes.STRING(255), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: true },
  youtube_video_url: { type: DataTypes.STRING(500), allowNull: true }
}, {
  tableName: 'lessons',
  underscored: true,
  timestamps: false
});

const EnrollmentModel = sequelize.models.Enrollment || sequelize.define('Enrollment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('active', 'completed'), allowNull: false, defaultValue: 'active' },
  enrolled_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'enrollments',
  underscored: true,
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'course_id'], name: 'uq_user_course' }
  ]
});

const ProgressModel = sequelize.models.Progress || sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  completion_percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
  last_accessed: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'progress',
  underscored: true,
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'course_id'], name: 'uq_user_course_prog' }
  ]
});

const PerformanceModel = sequelize.models.Performance || sequelize.define('Performance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  completed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'performance',
  underscored: true,
  timestamps: false
});

const CourseFeedbackModel = sequelize.models.CourseFeedback || sequelize.define('CourseFeedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  learner_id: { type: DataTypes.INTEGER, allowNull: false },
  instructor_id: { type: DataTypes.INTEGER, allowNull: false },
  course_rating: { type: DataTypes.TINYINT, allowNull: false },
  instructor_rating: { type: DataTypes.TINYINT, allowNull: false },
  feedback: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'course_feedback',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['course_id', 'learner_id'], name: 'uq_course_feedback' }
  ]
});

if (!UserModel.associations.taughtCourses) {
  UserModel.hasMany(CourseModel, { as: 'taughtCourses', foreignKey: 'instructor_id' });
}
if (!CourseModel.associations.instructor) {
  CourseModel.belongsTo(UserModel, { as: 'instructor', foreignKey: 'instructor_id' });
}
if (!CourseModel.associations.modules) {
  CourseModel.hasMany(ModuleModel, { as: 'modules', foreignKey: 'course_id' });
}
if (!ModuleModel.associations.course) {
  ModuleModel.belongsTo(CourseModel, { as: 'course', foreignKey: 'course_id' });
}
if (!ModuleModel.associations.lessons) {
  ModuleModel.hasMany(LessonModel, { as: 'lessons', foreignKey: 'module_id' });
}
if (!LessonModel.associations.module) {
  LessonModel.belongsTo(ModuleModel, { as: 'module', foreignKey: 'module_id' });
}
if (!UserModel.associations.enrollments) {
  UserModel.hasMany(EnrollmentModel, { as: 'enrollments', foreignKey: 'user_id' });
}
if (!EnrollmentModel.associations.user) {
  EnrollmentModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });
}
if (!CourseModel.associations.enrollments) {
  CourseModel.hasMany(EnrollmentModel, { as: 'enrollments', foreignKey: 'course_id' });
}
if (!EnrollmentModel.associations.course) {
  EnrollmentModel.belongsTo(CourseModel, { as: 'course', foreignKey: 'course_id' });
}
if (!UserModel.associations.progressRecords) {
  UserModel.hasMany(ProgressModel, { as: 'progressRecords', foreignKey: 'user_id' });
}
if (!ProgressModel.associations.user) {
  ProgressModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });
}
if (!CourseModel.associations.progressRecords) {
  CourseModel.hasMany(ProgressModel, { as: 'progressRecords', foreignKey: 'course_id' });
}
if (!ProgressModel.associations.course) {
  ProgressModel.belongsTo(CourseModel, { as: 'course', foreignKey: 'course_id' });
}
if (!UserModel.associations.performances) {
  UserModel.hasMany(PerformanceModel, { as: 'performances', foreignKey: 'user_id' });
}
if (!PerformanceModel.associations.user) {
  PerformanceModel.belongsTo(UserModel, { as: 'user', foreignKey: 'user_id' });
}
if (!CourseModel.associations.performances) {
  CourseModel.hasMany(PerformanceModel, { as: 'performances', foreignKey: 'course_id' });
}
if (!PerformanceModel.associations.course) {
  PerformanceModel.belongsTo(CourseModel, { as: 'course', foreignKey: 'course_id' });
}
if (!CourseModel.associations.feedbackEntries) {
  CourseModel.hasMany(CourseFeedbackModel, { as: 'feedbackEntries', foreignKey: 'course_id' });
}
if (!CourseFeedbackModel.associations.course) {
  CourseFeedbackModel.belongsTo(CourseModel, { as: 'course', foreignKey: 'course_id' });
}
if (!UserModel.associations.learnerFeedback) {
  UserModel.hasMany(CourseFeedbackModel, { as: 'learnerFeedback', foreignKey: 'learner_id' });
}
if (!CourseFeedbackModel.associations.learner) {
  CourseFeedbackModel.belongsTo(UserModel, { as: 'learner', foreignKey: 'learner_id' });
}
if (!UserModel.associations.instructorFeedback) {
  UserModel.hasMany(CourseFeedbackModel, { as: 'instructorFeedback', foreignKey: 'instructor_id' });
}
if (!CourseFeedbackModel.associations.feedbackInstructor) {
  CourseFeedbackModel.belongsTo(UserModel, { as: 'feedbackInstructor', foreignKey: 'instructor_id' });
}

module.exports = {
  sequelize,
  UserModel,
  CourseModel,
  ModuleModel,
  LessonModel,
  EnrollmentModel,
  ProgressModel,
  PerformanceModel,
  CourseFeedbackModel
};
