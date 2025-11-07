const movieRouter = require('express').Router()
const movieController = require('../controllers/movieController.js')

movieRouter.get('/', movieController.index)
movieRouter.get('/:id', movieController.show)

module.exports = movieRouter;