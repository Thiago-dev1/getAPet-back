const { verify } = require("jsonwebtoken")

async function ensureAuthenticated(req, res, next) { 
    let currentUser

    const authHeader = req.headers.authorization

    if(!authHeader) {
       return res.status(400).json({message: 'Sem token!!'})
    }

    const [, token] = authHeader.split(" ")  
    // console.log(token)

    try {
        const { id: userId } = verify(token, String(process.env.SECRETO))

        req.user = {
            id: userId
        }

        next()
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: 'Token expirado!'})
    }

}

module.exports = ensureAuthenticated