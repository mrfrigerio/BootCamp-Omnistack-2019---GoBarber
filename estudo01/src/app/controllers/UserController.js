import User from '../models/User'

class UserController {
  async store(req, res) {

    const storedUser = await User.findOne({ email: req.email })
    if (storedUser) {
      res.status(401).json({ error: 'User already exists!' })
    }
    const user = await User.create(req.body)
    return res.json(user)
  }
}

export default new UserController()
