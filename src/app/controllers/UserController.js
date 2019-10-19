import User from '../models/User'
import * as Yup from 'yup'
// index, show, store, update, delete

class UserController {

  async store(req, res) {
    // const { name, email, password, provider } = req.body

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    const userExists = await User.findOne({ where: { email: req.body.email } })
    if (userExists) {
      return res.status(400).json({ error: 'User already exists!' })
    }

    const { id, name, email, provider } = await User.create(req.body)
    return res.json({
      id,
      name,
      email,
      provider
    })
  }

  async index(req, res) {
    const users = await User.findAll()
    return res.json(users)
  }

  async update(req, res) {
    return res.json({ ok: true })
  }
}

export default new UserController()
