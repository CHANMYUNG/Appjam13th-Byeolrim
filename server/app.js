/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const database = require('./database/index')

const config = require('./config')


const app = express()


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(morgan('dev'))


app.set('jwt-secret', config.secret)
app.set('port', config.server_port)

app.get('/', (req, res) => {
    res.send('Hello JWT')
})

app.use('/api', require('./routes/api'))

app.listen(app.get('port'), () => {
    console.log(`Express is running on port ${app.get('port')}`)
    database.init(app);
})



