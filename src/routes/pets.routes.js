const { Router } = require('express')
const PetController = require('../controllers/PetController')
const  ensureAuthenticated  = require('../middlewares/ensureAuthenticated')
const imageUpload = require('../middlewares/image-uplaod')

const petsRoutes = Router()

petsRoutes.post('/create', ensureAuthenticated, imageUpload.array('images') , PetController.create)
petsRoutes.get('/mypets', ensureAuthenticated, PetController.getAllUserPets)
petsRoutes.get('/myadoptions', ensureAuthenticated, PetController.getAllUserAdoptions)
petsRoutes.patch('/edit/:id', ensureAuthenticated, imageUpload.array('images'), PetController.edit)
petsRoutes.patch('/schedule/:id', ensureAuthenticated, PetController.schedule)
petsRoutes.patch('/conclude/:id', ensureAuthenticated, PetController.concludeAdoption)
petsRoutes.delete('/:id', ensureAuthenticated, PetController.deletePetById)
petsRoutes.get('/', PetController.getAllPets) 
petsRoutes.get('/:id', PetController.getPetById)

module.exports = petsRoutes