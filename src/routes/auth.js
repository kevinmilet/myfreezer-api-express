// Import des modules nécessaires
const express = require('express');
const authController = require('../controllers/authCtrl');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource Auth
router.post('/login', authController.login);

module.exports = router;
