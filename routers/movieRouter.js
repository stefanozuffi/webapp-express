const movieRouter = require('express').Router()
const upload = require('../middlewares/fileUpload.js');
const movieController = require('../controllers/movieController.js')

movieRouter.get('/', movieController.index)
movieRouter.get('/:id', movieController.show)
movieRouter.post('/', upload.single('image'), movieController.store)
movieRouter.post('/:id/reviews', movieController.storeReview)

module.exports = movieRouter;