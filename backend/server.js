const express = require('express')
const { connection, query } = require('./database/configuration.js')

const app = express()
const PORT = process.env.PORT || 3000

//Middlewares for static files and json parsing
app.use(express.static('public'))
app.use(express.json())

//Run
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
}) 

//Homepage
app.get('/', (req,res) => {
    res.send("Welcome to the webapp backend")
})