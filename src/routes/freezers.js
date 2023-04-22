// Import des modules nécessaires
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const DB = require('../config/db.config');
const Freezer = DB.Freezer;
const User = DB.User;
const FreezerType = DB.FreezerType;

// Récupération du router d'express
let router = express.Router();

// Middleware pour logger les dates
router.use((req, res, next) => {
	const event = new Date();
	console.log('FREEZER Time: ', event.toString());
	next();
});

// Routage de la ressource Freezer
router.get('', (req, res) => {
	Freezer.findAll()
		.then(freezers => res.json({ data: freezers }))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.get('/:id', (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	Freezer.findOne({
		where: { id: freezerId },
		include: [
			{
				model: User,
				attributes: ['id', 'firstname', 'lastname', 'email', 'account_id'],
			},
			{
				model: FreezerType,
				attributes: ['id', 'name'],
			},
		],
	})
		.then(freezer => {
			if (freezer === null) {
				return res.status(404).json({ message: 'Freezer not found' });
			}

			return res.json({ data: freezer });
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.put('', (req, res) => {
	const { name, freezer_type_id, user_id } = req.body;

	if (!name || !freezer_type_id || !user_id) {
		return res.status(400).json({ message: 'Missing data' });
	}

	const data = {
		name: '',
		freezer_type_id: null,
		user_id: null,
		freezer_id: '',
	};

	let str = name.toString().trim();

	data.name = str[0].toUpperCase() + str.slice(1).toLowerCase();
	data.freezer_type_id = freezer_type_id;
	data.user_id = user_id;
	data.freezer_id = uuidv4().toString().replace('-', '');

	Freezer.create(data)
		.then(freezer => res.json({ message: 'Freezer created', data: freezer }))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.patch('/:id', (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	Freezer.findOne({ where: { id: freezerId }, raw: true })
		.then(freezer => {
			if (freezer === null) {
				return res.status(404).json({ message: 'Freezer not found' });
			}

			const data = {
				name: '',
				freezer_type_id: 0,
			};

			data.name =
				req.body.name != undefined ? req.body.name.trim() : freezer.name;
			data.freezer_type_id =
				req.body.freezer_type_id != undefined
					? req.body.freezer_type_id
					: freezer.freezer_type_id;

			Freezer.update(data, { where: { id: freezerId } })
				.then(freezer =>
					res.json({ message: 'Freezer updated', data: freezer })
				)
				.catch(err =>
					res.status(500).json({ message: 'Database error 1', error: err })
				);
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error 2', error: err })
		);
});

router.delete('/:id', (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Supression du Freezer
	Freezer.destroy({ where: { id: freezerId }, force: true })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.delete('/trash/:id', (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Soft delete du freezer
	Freezer.destroy({ where: { id: freezerId } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.post('/untrash/:id', (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	Freezer.restore({ where: { id: freezerId } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

module.exports = router;
