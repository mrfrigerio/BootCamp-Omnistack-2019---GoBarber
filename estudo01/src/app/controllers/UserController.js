import User from '../models/User'

class UserController {
  async store(req, res) {

    const storedUser = await User.findOne({ where: { email: req.body.email } })
    if (storedUser) {
      return res.status(401).json({ error: 'User already exists!' })
    }
    // const { id, name, email, provider } = await User.create(req.body)
    // return res.json({ id, name, email, provider })

    const user = await User.create(req.body)
    return res.json(user)
  }

  index = async (req, res) => res.json(await User.findAll())
}

export default new UserController()
