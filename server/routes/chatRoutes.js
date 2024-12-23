const router= require('express').Router();

const authMiddleware = require('./../middlewares/authMiddleware');
const chatControllers = require('./../controllers/chatControllers');

router.route('/create-chat')
    .post(authMiddleware,chatControllers.createChat)
    
router.route('/unread-messages')
    .post(authMiddleware,chatControllers.messageCountController)

    router.route('/')
    .get(authMiddleware,chatControllers.getAllChat)
module.exports = router;