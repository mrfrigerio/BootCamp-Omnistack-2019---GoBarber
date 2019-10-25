import Notification from '../schemas/Notification'
import User from '../models/User'

class NotificationController {
  async index(req, res) {

    const checkIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    })

    if (!checkIsProvider) {
      return res.jscon({ error: 'Only providers can query their notifications.' })
    }

    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(20)

    return res.json(notifications)
  }

  async update(req, res) {

    const { id: notification_id } = req.params
    const notification = await Notification.findOneAndUpdate({ _id: notification_id }, { read: true }, { new: true })
    res.json(notification)
  }

}

export default new NotificationController()
