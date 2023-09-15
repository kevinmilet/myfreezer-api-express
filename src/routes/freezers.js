// Import des modules nécessaires
const express = require('express');
const freezerController = require('../controllers/freezerCtrl');
const checkjwtTokenMiddleware = require('../middlewares/checktoken');
const roleCheck = require('../middlewares/roleCheck');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource Freezer
router.get(
	'',
	checkjwtTokenMiddleware,
	roleCheck(true),
	freezerController.getAllFreezers
);

router.get('/:id', checkjwtTokenMiddleware, freezerController.getFreezerById);

router.put('', checkjwtTokenMiddleware, freezerController.createFreezer);

router.put('/:id', checkjwtTokenMiddleware, freezerController.updateFreezer);

router.delete('/:id', checkjwtTokenMiddleware, freezerController.deleteFreezer);

router.delete(
	'/trash/:id',
	checkjwtTokenMiddleware,
	freezerController.trashFreezer
);

router.post(
	'/untrash/:id',
	checkjwtTokenMiddleware,
	freezerController.restoreFreezer
);

router.get(
	'/user/:id',
	checkjwtTokenMiddleware,
	freezerController.getFreezersByUserId
);

module.exports = router;
