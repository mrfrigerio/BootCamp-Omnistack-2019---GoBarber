import * as Yup from 'yup'
import { startOfHour, isBefore, parseISO, differenceInHours, format } from 'date-fns'
import pt_BR from 'date-fns/locale/pt-BR'
import Appointment from '../models/Appointment'
import User from '../models/User'
import File from '../models/File'
import Notification from '../schemas/Notification'
import Queue from '../../lib/Queue'
import CancellationMail from '../jobs/CancellationMail'

class AppointmentController {

  async index(req, res) {
    const { page = 1 } = req.query
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [{
        model: User,
        as: 'provider',
        attibutes: ['id', 'name'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      }]
    })

    res.json(appointments)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    })

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation fails!' })
    }

    const { provider_id, date } = req.body

    /**
     * Check if the provider_id is a real provider
     */

    const isProvider = await User.findOne({ where: { id: provider_id, provider: true } })

    if (!isProvider) {
      return res.status(401).json({ error: 'You can only create appointments with providers!' })
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date))

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json('Past dates are not permitted')
    }

    /**
     * Check date availability
     */

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    })

    if (checkAvailability) {
      return res.status(400).json('Appointment date is not available')
    }

    const { name: user_name, id: user_id } = await User.findByPk(req.userId)

    /**
     * Check is myself
     */

    if (provider_id === user_id) {
      return res.status(400).json('You can not scheldule an appointment with yourself.')
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date: hourStart
    })

    /**
     * Notify provider
     */

    const formattedDate = format(hourStart, "'o dia' dd 'de' MMMM' de' yyyy 'às' HH:mm", { locale: pt_BR })
    Notification.create({
      content: `Novo agendamento de ${user_name} para ${formattedDate}`,
      user: provider_id
    })

    return res.json({ appointment })

  }

  async delete(req, res) {

    /**
     *  Somente é possível cancelar agendamentos do próprio usuário logado e com mais de 2h de antecedência
     */

    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    })
    const { user_id, date } = appointment

    if (user_id !== req.userId) {
      return res.status(401).json({ error: "You don't have permission to cancel this appointment." })
    }

    if (differenceInHours(date, new Date()) < 2) {
      return res.status(401).json({ error: "Sorry. We can't cancel an appointment closer than 2 hours from now" })
    }

    await Queue.add(CancellationMail.key, { appointment })

    const updatedAppointment = await appointment.update({ canceled_at: new Date() })
    return res.json(updatedAppointment)

  }


}

export default new AppointmentController()
