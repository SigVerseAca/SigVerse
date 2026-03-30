const { UserModel } = require('./models');

function toPlain(instance) {
  return instance ? instance.get({ plain: true }) : null;
}

class User {
  static findAll() {
    return UserModel.findAll({
      attributes: ['id', 'name', 'email', 'role', 'github_id', 'avatar_url', 'created_at', 'updated_at'],
      raw: true
    });
  }

  static findById(id) {
    return UserModel.findByPk(id, { raw: true });
  }

  static findByGithubId(github_id) {
    return UserModel.findOne({ where: { github_id }, raw: true });
  }

  static findByEmail(email) {
    return UserModel.findOne({ where: { email }, raw: true });
  }

  static async create(data) {
    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      role: data.role || 'learner',
      github_id: data.github_id || null,
      avatar_url: data.avatar_url || null
    });

    return this.findById(user.id);
  }

  static async update(id, data) {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    await user.update({
      name: data.name,
      email: data.email,
      role: data.role
    });

    return this.findById(id);
  }

  static async patch(id, data) {
    const user = await UserModel.findByPk(id);
    if (!user) return null;
    if (!Object.keys(data || {}).length) return toPlain(user);

    await user.update(data);
    return this.findById(id);
  }

  static async delete(id) {
    const deleted = await UserModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = User;
