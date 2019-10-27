import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import authConfig from '../../config/auth'


export default async function (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret) // Caso não consiga decodificar, retorna uma exception e cai no catch
    req.userId = id
    return next()

  } catch (err) { //token inválido
    return res.status(401).json({ error: `Invalid token!: ${err}` })
  }

}
