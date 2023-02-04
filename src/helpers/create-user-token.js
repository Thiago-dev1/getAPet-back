const jwt = require('jsonwebtoken')

async function createUserToken(user, req, res) {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, String(process.env.SECRETO))

   return res.status(200).json({
        message: 'Você está autenticado',
        token: token,
        userId: user._id
    })
}

module.exports = createUserToken