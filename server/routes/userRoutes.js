const router= require('express').Router();
// const multer = require('multer');
const authMiddleware = require('./../middlewares/authMiddleware');
const userControllers = require('./../controllers/userControllers');


router.route('/get-user')
    .get(authMiddleware, userControllers.loggedInUser)

router.route('/get-all-users')
    .get(authMiddleware, userControllers.getAllUsers)

router.route('/profile-pic-upload')
    .post(authMiddleware,userControllers.profilePicUpload)
module.exports = router;