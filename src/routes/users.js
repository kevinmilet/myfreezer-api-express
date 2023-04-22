// Import des modules nécessaires
const express = require('express');
const userController = require('../controllers/user');
const checkjwtTokenMiddleware = require('../middlewares/checktoken');

let router = express.Router();

router.get('/', checkjwtTokenMiddleware, userController.getAllUsers);

router.get('/:id', checkjwtTokenMiddleware, userController.getUserById);

router.put('', userController.createUser);

router.patch('/:id', checkjwtTokenMiddleware, userController.updateUser);

router.delete('/:id', checkjwtTokenMiddleware, userController.deleteUser);

router.delete('/trash/:id', checkjwtTokenMiddleware, userController.trashUser);

router.post(
	'/untrash/:id',
	checkjwtTokenMiddleware,
	userController.untrashUser
);

module.exports = router;
