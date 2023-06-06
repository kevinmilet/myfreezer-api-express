// Import des modules nécessaires
const express = require('express');
const freezerTypeController = require('../controllers/freezertypeCtrl');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource FreezerType
router.get('', freezerTypeController.getAllFreezerTypes);

router.get('/:id', freezerTypeController.getFreezerTypeById);

router.put('', freezerTypeController.createFreezerType);

router.put('/:id', freezerTypeController.updateFreezerType);

router.delete('/:id', freezerTypeController.deleteFreezerType);

router.delete('/trash/:id', freezerTypeController.trashFreezerType);

router.post('/untrash/:id', freezerTypeController.untrashFreezerType);

module.exports = router;
