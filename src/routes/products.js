// Import des modules nécessaires
const express = require('express');
const productController = require('../controllers/productCtrl');
const checkjwtTokenMiddleware = require('../middlewares/checktoken');
const roleCheck = require('../middlewares/roleCheck');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource Product
router.get(
	'',
	checkjwtTokenMiddleware,
	roleCheck(true),
	productController.getAllProducts
);

router.get('/search', checkjwtTokenMiddleware, productController.searchProduct);

router.get('/:id', checkjwtTokenMiddleware, productController.getProductById);

router.put('', checkjwtTokenMiddleware, productController.createProduct);

router.put('/:id', checkjwtTokenMiddleware, productController.updateProduct);

router.delete('/:id', checkjwtTokenMiddleware, productController.deleteProduct);

router.delete(
	'/trash/:id',
	checkjwtTokenMiddleware,
	productController.trashProduct
);

router.post(
	'/untrash/:id',
	checkjwtTokenMiddleware,
	productController.restoreProduct
);

router.get(
	'/user/:id',
	checkjwtTokenMiddleware,
	productController.getProductsByUserId
);

router.get(
	'/freezer/:id',
	checkjwtTokenMiddleware,
	productController.getProductsByFreezerId
);

module.exports = router;
