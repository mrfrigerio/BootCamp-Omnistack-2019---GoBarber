import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Model {
  static init(connection) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,

    },
      { sequelize: connection }
    )

    this.addHook('beforeSave', async (user, options) => {
      user.password && (user.password_hash = await bcrypt.hash(user.password, 8))
    })
    return this //optional
  }

  checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password_hash)
  }

}

export default User
