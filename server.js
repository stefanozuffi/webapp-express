const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

//Middlewares for static files and json parsing
app.use(express.static('public'))
app.use(express.json())

//Middleware for CORS
app.use(cors({ origin: 'http://localhost:5173'}));

//Homepage
app.get('/', (req,res) => {
    res.send("Welcome to the webapp backend")
})

//Middleware Router(s)
const movieRouter = require('./routers/movieRouter.js')
app.use('/api/movies', movieRouter)

//Middleware Server Error (gestisce errori)
const serverError = require('./middlewares/serverError.js')
app.use(serverError);

//Middleware Endpoint Not Found Error (deve essere ultimo!)
const notFound = require('./middlewares/notFound.js')
app.use(notFound)

//Run (meglio alla fine)
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})