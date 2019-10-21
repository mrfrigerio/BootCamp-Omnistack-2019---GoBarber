import { Router } from 'express'
import multer from 'multer'

import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import authMiddleware from './app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)

// ROUTES

//Sessions
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

// Users
routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.put('/users', UserController.update)

// Files
routes.post('/files', upload.single('file'), FileController.store)

export default routes