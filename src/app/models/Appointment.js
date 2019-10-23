import Sequelize, { Model } from 'sequelize'

/** Quando definir os campos, não é necessário definir os campos de chave promária e os
 * created_at / updated_at, mas sim apenas os campos que são alimentados por inputs do usuário */

class Appointment extends Model {
  static init(sequelize) {
    super.init({
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
    },
      {
        sequelize
      })

    return this //optional
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' })
  }
}
export default Appointment
