const User = require('../models/User')
const { hash, compare } = require('bcrypt')
const createUserToken = require('../helpers/create-user-token')

class UserController {
    static async create(req, res) {

        const { name, email, phone, password, confirmedPassword } = req.body

        if(!name || !email || !phone || !password || !confirmedPassword) {
            return res.status(400).json({message: 'Preencha os campos obrigatorios!'})
        }

        let image = ''

        if(req.file) {
            image = req.file.filename
        }

        const userAlreadyExists = await User.findOne({email: email})

        if(userAlreadyExists) {
            return res.status(400).json({message: 'Email já cadastrado!'})
        }

        if(password !== confirmedPassword) {
            return res.status(400).json({message: 'As senhas precisão ser iguais!!!'})
        }

        const passowordHash = await hash(password, 8)
        
        const user = new User({name, email, phone, password: passowordHash, image})
        
        try {

            await user.save()
    
            await createUserToken(user, req, res)

            return res.status(201)
        } catch (err) {
            console.log(err)
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).json({message: 'Preencha os campos obrigatorios!'})
        }

        const userAlreadyExists = await User.findOne({email: email})
        
        if(!userAlreadyExists) {
            return res.status(400).json({message: 'Email não encontrado!!'})
        }

        const passwordMatch = await compare(password, userAlreadyExists.password)

        if(!passwordMatch) {
            return res.status(400).json({message: "Senha inválida!!"})
        }

        await createUserToken(userAlreadyExists, req, res)

        return res.status(200)
    }

    static async edit(req, res) {
        const { id } = req.user

        const user = await User.findById(id)

        if(!user) {
            return res.status(400).json({message: 'Usuario não encontrado!'})
        }

        const { name, phone, email } = req.body

        let image = ''

        if(req.file) {
            image = req.file.filename
        }

        const data = { name, image, phone, email }

        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists) {
            return res.status(400).json({message: 'Utilize outro email'})
        }

        try {
            const userUpdate = await User.updateOne({_id: id}, data)

            // await userUpdate.save()
            
            res.status(200).json({message: 'Editado com sucesso.'})
        } catch (err) {
            console.log(err)
        }
    }

    static async getUserById(req, res) {
        const { id } = req.user

        const user = await User.findById(id).select('-password')

        if(!user) {
            return res.status(400).json({message: 'Usuario não encontrado'})
        }

        return res.status(200).json({user})
    }
}

module.exports = UserController