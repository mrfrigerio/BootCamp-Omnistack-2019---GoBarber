import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

/** Quando definir os campos, não é necessário definir os campos de chave promária e os
 * created_at / updated_at, mas sim apenas os campos que são alimentados por inputs do usuário */

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,   // --> Will not be persisted
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN
    },
      {
        sequelize
      })

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8)
      }
    })
    return this //optional
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }

}
export default User
