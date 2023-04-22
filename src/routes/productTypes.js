// Import des modules nécessaires
const express = require('express');
const DB = require('../config/db.config');
const productType = require('../models/product-type');
const ProductType = DB.ProductType;

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource ProductType
router.get('', (req, res) => {
	ProductType.findAll()
		.then(productType => res.json({ data: productType }))
		.catch(err => {
			res.status(500).json({ message: 'Database error', error: err });
		});
});

router.get('/:id', (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	ProductType.findOne({ where: { id: id }, raw: true })
		.then(productType => {
			if (productType === null) {
				return res.status(404).json({ message: 'Product Type not found' });
			}

			return res.json({ data: productType });
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.put('', (req, res) => {
	if (!req.body.name) {
		return res.status(400).json({ message: 'Missing data' });
	}

	// On nettoie et on formate le nom
	let str = req.body.name.toString().trim();
	req.body.name = str[0].toUpperCase() + str.slice(1).toLowerCase();

	ProductType.create(req.body)
		.then(productType =>
			res.json({ message: 'Product Type created', data: productType })
		)
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.patch('/:id', (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	ProductType.findOne({ where: { id: id }, raw: true })
		.then(productType => {
			if (productType === null) {
				return res.status(404).json({ message: 'Product Type not found' });
			}
			// On nettoie et on formate le nom
			let str = req.body.name.toString().trim();
			req.body.name = str[0].toUpperCase() + str.slice(1).toLowerCase();

			ProductType.update(req.body, { where: { id: id } })
				.then(productType =>
					res.json({ message: 'Product type updated', data: productType })
				)
				.catch(err =>
					res.status(500).json({ message: 'Database error', error: err })
				);
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.delete('/:id', (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Supression du Product type
	ProductType.destroy({ where: { id: id }, force: true })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.delete('/trash/:id', (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Soft delete
	ProductType.destroy({ where: { id: id } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.post('/untrash/:id', (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	ProductType.restore({ where: { id: id } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

module.exports = router;
