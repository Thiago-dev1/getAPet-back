const { Router } = require('express')
const UserController = require('../controllers/UserController')
const  ensureAuthenticated  = require('../middlewares/ensureAuthenticated')
const imageUpload = require('../middlewares/image-uplaod')

const usersRoutes = Router()

usersRoutes.post('/create', imageUpload.single('image'), UserController.create)
usersRoutes.post('/login', UserController.login)
usersRoutes.get('/:id', ensureAuthenticated, UserController.getUserById)
usersRoutes.patch('/edit/:id', ensureAuthenticated, imageUpload.single('image'), UserController.edit)

module.exports = usersRoutes