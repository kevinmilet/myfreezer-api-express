// Import des modules nécessaires
const express = require('express');
const productTypeController = require('../controllers/producttypeCtrl');
const checkjwtTokenMiddleware = require('../middlewares/checktoken');
const roleCheck = require('../middlewares/roleCheck');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource ProductType
router.get(
	'',
	checkjwtTokenMiddleware,
	productTypeController.getAllProductTypes
);

router.get(
	'/:id',
	checkjwtTokenMiddleware,
	productTypeController.getProductTypeById
);

router.put(
	'',
	checkjwtTokenMiddleware,
	roleCheck(true),
	productTypeController.createProductType
);

router.put(
	'/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	productTypeController.updateProductType
);

router.delete(
	'/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	productTypeController.deleteProductType
);

router.delete(
	'/trash/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	productTypeController.trashProductType
);

router.post(
	'/untrash/:id',
	checkjwtTokenMiddleware,
	roleCheck(true),
	productTypeController.restoreProductType
);

module.exports = router;
