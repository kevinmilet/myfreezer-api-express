// Import des modules nécessaires
const express = require('express');
const productTypeController = require('../controllers/producttypeCtrl');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource ProductType
router.get('', productTypeController.getAllProductTypes);

router.get('/:id', productTypeController.getProductTypeById);

router.put('', productTypeController.createProductType);

router.put('/:id', productTypeController.updateProductType);

router.delete('/:id', productTypeController.deleteProductType);

router.delete('/trash/:id', productTypeController.trashProductType);

router.post('/untrash/:id', productTypeController.restoreProductType);

module.exports = router;
