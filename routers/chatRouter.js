const chatRouter = require('express').Router();
const chatController = require('../controllers/chatController.js');

chatRouter.post('/chat', chatController.chat);

module.exports = chatRouter;