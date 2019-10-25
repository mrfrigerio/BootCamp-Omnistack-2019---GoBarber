import { Router } from 'express'
import multer from 'multer'

import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController'
import ScheduleController from './app/controllers/ScheduleController'
import NotificationController from './app/controllers/NotificationController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)

// ROUTES

//Sessions
routes.post('/sessions', SessionController.store)


// Users
routes.post('/users', UserController.store)

routes.use(authMiddleware)

routes.get('/users', UserController.index)
routes.put('/users', UserController.update)

// Providers
routes.get('/providers', ProviderController.index)
routes.get('/providers/:providerId/')

// Files
routes.post('/files', upload.single('file'), FileController.store)

// Appointments
routes.get('/appointments', AppointmentController.index)
routes.post('/appointments', AppointmentController.store)
routes.delete('/appointments/:id', AppointmentController.delete)

// Schedule
routes.get('/schedule', ScheduleController.index)

// Notificationsa
routes.get('/notifications', NotificationController.index)
routes.put('/notifications/:id', NotificationController.update)

export default routes
