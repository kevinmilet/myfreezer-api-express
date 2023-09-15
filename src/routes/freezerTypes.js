// Import des modules nécessaires
const express = require('express');
const freezerTypeController = require('../controllers/freezertypeCtrl');
const checkjwtTokenMiddleware = require('../middlewares/checktoken');
const roleCheck = require('../middlewares/roleCheck');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource FreezerType
router.get(
	'',
	checkjwtTokenMiddleware,
	freezerTypeController.getAllFreezerTypes
);

router.get(
	'/:id',
	checkjwtTokenMiddleware,
	freezerTypeController.getFreezerTypeById
);

router.put(
	'',
	checkjwtTokenMiddleware,
	roleCheck(true),
	freezerTypeController.createFreezerType
);

router.put(
	'/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	freezerTypeController.updateFreezerType
);

router.delete(
	'/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	freezerTypeController.deleteFreezerType
);

router.delete(
	'/trash/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	freezerTypeController.trashFreezerType
);

router.post(
	'/untrash/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	freezerTypeController.untrashFreezerType
);

module.exports = router;
