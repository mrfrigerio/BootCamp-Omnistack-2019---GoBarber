import jwt from 'jsonwebtoken'
import User from '../models/User'

class SessionController {
  async store(req, res) {

    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    // Verify user existence
    if (!user) {
      return res.status(401).json({ error: `User not found: ${email}` })
    }

    // Check password
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Pasword doesn\'t match' })
    }

    const { id, name } = user

    return res.json({
      user: {
        id, name, email
      },
      token: jwt.sign({ id }, 'b7236c33dee74bbdc877fafafd037330', { expiresIn: '7d' })

    })
  }
}

export default new SessionController()
