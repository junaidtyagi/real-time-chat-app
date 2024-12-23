const router = require('express').Router();

const authControllers = require('./../controllers/authControllers');


router.route('/signup')
    .post(authControllers.signup)

router.route('/login')
    .post(authControllers.login)



module.exports = router;