import { Router } from 'express'
import UserController from './app/controllers/UserController'

const routes = Router()

routes.get('/teste', (req, res) => res.json({ message: 'Funcionou!' }))
routes.post('/users', UserController.store)

export default routes
