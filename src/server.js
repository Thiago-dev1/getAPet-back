const express = require('express')
const cors = require('cors')

const path = require('path')

const conn = require('./db/conn')
const router = require('./routes/index.routes')

const app = express()
app.use(cors())
app.use(express.static(path.resolve('public')))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(router)
app.get('/', (req, res) => {
    res.json({mesage: 'aqui'})
})

app.listen(5000, () => console.log('Server On!'))