// Import des modules nécessaires
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const DB = require('../config/db.config');
const Product = DB.Product;

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource Product
router.get('', (req, res) => {
	Product.findAll()
		.then(products => res.json({ data: products }))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

module.exports = router;
