// Import des modules nécessaires
const express = require('express');
const DB = require('../config/db.config');
const freezerType = require('../models/freezer-type');
const FreezerType = DB.FreezerType;

// Récupération du router d'express
let router = express.Router();

// Middleware pour logger les dates
router.use((req, res, next) => {
	const event = new Date();
	console.log('FREEZER TYPE Time: ', event.toString());
	next();
});

// Routage de la ressource FreezerType
router.get('', (req, res) => {
	FreezerType.findAll()
		.then(freezerType => res.json({ data: freezerType }))
		.catch(err => {
			res.status(500).json({ message: 'Database error', error: err });
		});
});

router.get('/:id', (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	FreezerType.findOne({ where: { id: id }, raw: true })
		.then(freezerType => {
			if (freezerType === null) {
				return res.status(404).json({ message: 'Freezer Type not found' });
			}

			return res.json({ data: freezerType });
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

	FreezerType.create(req.body)
		.then(freezerType =>
			res.json({ message: 'Freezer Type created', data: freezerType })
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

	FreezerType.findOne({ where: { id: id }, raw: true })
		.then(freezerType => {
			if (freezerType === null) {
				return res.status(404).json({ message: 'Freezer Type not found' });
			}
			// On nettoie et on formate le nom
			let str = req.body.name.toString().trim();
			req.body.name = str[0].toUpperCase() + str.slice(1).toLowerCase();

			FreezerType.update(req.body, { where: { id: id } })
				.then(freezerType =>
					res.json({ message: 'Freezer Type updated', data: freezerType })
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

	// Supression du freezer type
	FreezerType.destroy({ where: { id: id }, force: true })
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
	FreezerType.destroy({ where: { id: id } })
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

	FreezerType.restore({ where: { id: id } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

module.exports = router;
