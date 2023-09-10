// Import des modules nécessaires
const express = require('express');
const userController = require('../controllers/userCtrl');
const checkjwtTokenMiddleware = require('../middlewares/checktoken');

let router = express.Router();

/**
 * Routes pour les users
 */
router.get('/', checkjwtTokenMiddleware, userController.getAllUsers);

router.get('/search', checkjwtTokenMiddleware, userController.searchUser);

router.get('/:id', checkjwtTokenMiddleware, userController.getUserById);

router.put('', userController.createUser);

router.put('/:id', checkjwtTokenMiddleware, userController.updateUser);

router.delete('/:id', checkjwtTokenMiddleware, userController.deleteUser);

router.delete('/trash/:id', checkjwtTokenMiddleware, userController.trashUser);

router.post(
	'/untrash/:id',
	checkjwtTokenMiddleware,
	userController.untrashUser
);

module.exports = router;
