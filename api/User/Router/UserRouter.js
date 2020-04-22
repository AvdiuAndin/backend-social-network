var express = require('express');
var UserController = require('../Controller/UserController');
var AuthMiddleware = require('@middleware/Auth/AuthMiddeware');
var router = express.Router();



/*AUTH*/
router.post('/signup', UserController.signUp);
router.post('/login', UserController.login);

/*USER DATA*/
router.get('/me', AuthMiddleware.authenticateRequest, UserController.me);
router.put('/me/update-password', AuthMiddleware.authenticateRequest,  UserController.updatePassword);

/*USER ACTIONS*/
router.get('/user/:id', UserController.userInfoAndLikes);
router.post('/user/:id/like', AuthMiddleware.authenticateRequest, UserController.likeAUser);
router.put('/user/:id/unlike', AuthMiddleware.authenticateRequest, UserController.unLikeAUser);

router.get('/most-liked', UserController.mostLiked);

module.exports = router;
