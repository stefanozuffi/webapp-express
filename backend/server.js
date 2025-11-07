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

//Middleware Router(s)
const movieRouter = require('./routers/movieRouter.js')
app.use('/api/movies', movieRouter)


//Middleware Endopoint Not Found Error
const notFound = require('./middlewares/notFound.js')
app.use(notFound)

//Middleware Server Error
const serverError = require('./middlewares/serverError.js')
app.use(serverError);