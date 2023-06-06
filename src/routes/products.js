// Import des modules nécessaires
const express = require('express');
const productController = require('../controllers/productCtrl');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource Product
router.get('', productController.getAllProducts);

router.get('/search', productController.searchProduct);

router.get('/:id', productController.getProductById);

router.put('', productController.createProduct);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

router.delete('/trash/:id', productController.trashProduct);

router.post('/untrash/:id', productController.restoreProduct);

router.get('/user/:id', productController.getProductsByUserId);

router.get('/freezer/:id', productController.getProductsByFreezerId);

module.exports = router;
