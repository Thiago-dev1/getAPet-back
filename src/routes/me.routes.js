const { Router } = require('express')
const UserController = require('../controllers/UserController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const meRoutes = Router()

meRoutes.get('/me', ensureAuthenticated, UserController.getUserById)

module.exports = meRoutes