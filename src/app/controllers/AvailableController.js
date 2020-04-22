import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter
} from 'date-fns'
import { Op } from 'sequelize'

import User from '../models/User'
import Appointment from '../models/Appointment'

class AvailableController {
  async index(req, res) {
    const { providerId } = req.params
    const { date } = req.query

    if (!date) {
      return res.json({ error: 'Invalid informed date [query param]' })
    }

    const searchDate = parseInt(date, 10)

    /**
     * Check if is a provider
     */

    const provider = await User.findOne({
      where: {
        id: providerId,
        provider: true
      }
    })

    if (!provider) {
      return res.json({
        error: `There is no provider with id [${providerId}].`
      })
    }

    const appointments = await Appointment.findAll({
      where: {
        provider_id: providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      },
      order: [['date', 'ASC']]
    })

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00'
    ]

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      )

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time)
      }
    })

    return res.json(available)
  }
}

export default new AvailableController()
