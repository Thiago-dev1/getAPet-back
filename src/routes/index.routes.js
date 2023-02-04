const { Router } = require('express')
const meRoutes = require('./me.routes')
const petsRoutes = require('./pets.routes')
const usersRoutes = require('./users.routes')


const router = Router()

router.use('/users', usersRoutes)
router.use('/pets', petsRoutes)
router.use(meRoutes)

module.exports = router