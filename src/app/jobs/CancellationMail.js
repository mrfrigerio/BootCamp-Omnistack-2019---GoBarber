import Mail from '../../lib/Mail'
import { format, parseISO } from 'date-fns'
import pt_BR from 'date-fns/locale/pt-BR'

class CancellationMail {

  get key() {
    return 'CancellationMail'
  }

  async handle({ data }) {
    const { appointment } = data
    await Mail.sendMail({
      from: 'Equipe GoBarber <noreply@gobarber.com>',
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), " dd 'de' MMMM' de' yyyy' às 'HH:mm", { locale: pt_BR })
      }
    })
  }

}

export default new CancellationMail()
