const router= require('express').Router();

const authMiddleware = require('./../middlewares/authMiddleware');
const messageControllers = require('./../controllers/messageControllers');

router.route('/new-message')
    .post(authMiddleware, messageControllers.createMessage)

router.route('/:chatId')
    .get(authMiddleware, messageControllers.getAllMessages)

module.exports = router;