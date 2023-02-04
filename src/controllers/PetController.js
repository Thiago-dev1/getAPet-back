const Pet = require('../models/Pet')
const User = require('../models/User')
const { isValidObjectId } = require('mongoose')

class PetController {
    static async create(req, res) {
        const { id } = req.user

        const user = await User.findById(id).select('_id name phone image')

        const { name, age, weight, color } = req.body
        const images = req.files

        if(!name || !age || !weight || !color || !images ) {
            return res.status(400).json({message: 'Todos os campos são obrigatorio!!'})
        }

        const pet = new Pet({name, age, weight, color, images: [], user})

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
          await pet.save()

          return res.status(201).json({message: 'Pet criado com sucesso.'})
        } catch (err) {
            console.log(err)
        }
    }

    static async edit(req, res) {
        const { id: userId } = req.user
        const { id } = req.params
 
        if(!isValidObjectId(id)) {
            return res.status(200).json({message: 'ID inválido!'})
        }    

        const pet = await Pet.findById(id)

        if(!pet) {
            return res.status(200).json({message: 'Pet não encontrado'})
        }

        const user = await User.findById({_id: userId}) 

        if(pet.user._id.toString() !== user._id.toString()) { 
            return res.status(200).json({message: 'Error!'})
        }
 
        const { name, age, weight, color } = req.body
        const images = req.files || []

        let upImages = []

        images.map((image) => {
            upImages.push(image.filename)
        })
    

        let data = {}

        if(upImages.length == 0) {
            data = {
                name,
                age,
                weight,
                color            }
        } else {
            data = {
                name,
                age,
                weight,
                color,
                images: upImages
            }
        }


        await Pet.findByIdAndUpdate(id, data)

        return res.status(200).json({message: 'Atualizado com sucesso'})

    }

    static async deletePetById(req, res) {
        const { id: userId } = req.user
        const { id } = req.params
 
        if(!isValidObjectId(id)) {
            return res.status(200).json({message: 'ID inválido!'})
        }    

        const pet = await Pet.findById(id)

        if(!pet) {
            return res.status(200).json({message: 'Pet não encontrado'})
        }

        const user = await User.findById(userId)

        if(pet.user._id.toString() !== user._id.toString()) { 
            return res.status(200).json({message: 'Error!'})
        }

        await Pet.findOneAndDelete(id)

        return res.status(200).json({message: 'Pet deletado com sucesso!'})
    }

    static async getAllPets(req, res) {
        const pets = await Pet.find({'available': true}).sort('-createdAt')

        if(pets.length == 0) {
            return res.status(200).json({message: 'Nenhum pet cadastrado!'})
        }

        return res.status(200).json(pets)
    }

    static async getAllUserPets(req, res) {
        const { id } = req.user
        
        const user = await User.findById(id)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        if(pets.length == 0) {
            return res.status(200).json(pets)
        }

        return res.status(200).json(pets)

    }

    static async getAllUserAdoptions (req, res) {

        const { id } = req.user
        
        const user = await User.findById(id)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        if(pets.length == 0) {
            return res.status(200).json({message: 'Nenhum pet cadastrado!'})
        }

        return res.status(200).json(pets)

    }

    static async getPetById(req, res) {
        const { id } = req.params

        if(!isValidObjectId(id)) {
            return res.status(200).json({message: 'ID inválido!'})
        }        

        const pet = await Pet.findById(id)

        if(!pet) {
            return res.status(200).json({message: 'Pet não encontrado'})
        }

        return res.status(200).json(pet)
    }

    static async schedule(req, res) {
        const { id: userId } = req.user
        const { id } = req.params

        if(!isValidObjectId(id)) {
            return res.status(200).json({message: 'ID inválido!'})
        }        

        const pet = await Pet.findById(id)

        if(!pet) {
            return res.status(200).json({message: 'Pet não encontrado'})
        }

        const user = await User.findById(userId)

        console.log(pet.user._id, '   ', user._id)

        if(pet.user._id.toString() === user._id.toString()) { 
            return res.status(200).json({message: 'Não é possivel adotar esse pet'})
        }

        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                return res.status(400).json({message: 'Você já agendou uma vista para este pet!'})
            }
        }

        pet.adopter = {
            _id: user._id,  
            name: user.name,
            image: user.image,
            phone: user.phone
        }

        await Pet.findOneAndUpdate(pet._id, pet)

        return res.status(200).json({message: `A visita foi agendada, entre em contanto com ${pet.user.name} pelo telefone ${pet.user.phone}`})
    }

    static async concludeAdoption(req, res) {
        const { id: userId } = req.user
        const { id } = req.params

        if(!isValidObjectId(id)) {
            return res.status(200).json({message: 'ID inválido!'})
        }        

        const pet = await Pet.findById(id)

        if(!pet) {
            return res.status(200).json({message: 'Pet não encontrado'})
        }

        const user = await User.findById({_id: userId})

        if(pet.user._id.toString() !== user._id.toString()) { 
            return res.status(200).json({message: 'Error'})
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        return res.status(200).json({message: 'Ciclo de adoção concluido'})

        
    }
}

module.exports = PetController  