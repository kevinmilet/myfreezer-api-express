// Import des modules nécessaires
const express = require('express');
const authController = require('../controllers/authCtrl');
const { loginLimiter } = require('../middlewares/rateLimiter');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource Auth
router.post('/login', loginLimiter, authController.login);

module.exports = router;
