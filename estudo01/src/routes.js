import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

const routes = Router()

// Users
routes.get('/users', UserController.index)
routes.post('/users', UserController.store)

// Sessions
routes.post('/sessions', SessionController.store)

export default routes
