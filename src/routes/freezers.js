// Import des modules nécessaires
const express = require('express');
const freezerController = require('../controllers/freezerCtrl');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource Freezer
router.get('', freezerController.getAllFreezers);

router.get('/:id', freezerController.getFreezerById);

router.put('', freezerController.createFreezer);

router.put('/:id', freezerController.updateFreezer);

router.delete('/:id', freezerController.deleteFreezer);

router.delete('/trash/:id', freezerController.trashFreezer);

router.post('/untrash/:id', freezerController.restoreFreezer);

router.get('/user/:id', freezerController.getFreezersByUserId);

module.exports = router;
