import Sequelize, { Model } from 'sequelize'
import { isBefore, differenceInHours } from 'date-fns'

/** Quando definir os campos, não é necessário definir os campos de chave promária e os
 * created_at / updated_at, mas sim apenas os campos que são alimentados por inputs do usuário */

class Appointment extends Model {
  static init(sequelize) {
    super.init({
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(this.date, new Date())
        }
      },
      cancellable: {
        type: Sequelize.VIRTUAL,
        get() {
          return differenceInHours(this.date, new Date()) > 2
        }
      }
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
