import Sequelize, { Model } from 'sequelize'
import 'dotenv/config'
/** Quando definir os campos, não é necessário definir os campos de chave promária e os
 * created_at / updated_at, mas sim apenas os campos que são alimentados por inputs do usuário */

class File extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() { return `http://localhost:${process.env.SERVER_PORT}/files/${this.path}` }
      }
    },
      {
        sequelize
      })

    return this //optional
  }
}
export default File
