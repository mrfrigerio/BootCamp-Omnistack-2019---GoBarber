import Sequelize, { Model } from 'sequelize'

/** Quando definir os campos, não é necessário definir os campos de chave promária e os
 * created_at / updated_at, mas sim apenas os campos que são alimentados por inputs do usuário */

class File extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
    },
      {
        sequelize
      })

    return this //optional
  }

}
export default File
