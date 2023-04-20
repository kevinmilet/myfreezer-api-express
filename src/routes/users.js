// Import des modules nécessaires
const express = require('express');
const User = require('../models/user');

// Récupération du router d'express
let router = express.Router();

// Routage de la ressource User
router.get('', (req, res) => {
	User.findAll()
		.then(users => res.json({ data: users }))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.get('/:id', (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	User.findOne({ where: { id: userId }, raw: true })
		.then(user => {
			if (user === null) {
				return res.status(404).json({ message: 'User not found' });
			}

			return res.json({ data: user });
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.put('', (req, res) => {
	const { lastname, firstname, email, password, account_id } = req.body;

	if (!lastname || !firstname || !email || !password || !account_id) {
		return res.status(400).json({ message: 'Missing data' });
	}

	// Vérifie si l'user n'existe pas déjà
	User.findOne({ where: { email: email }, raw: true })
		.then(user => {
			if (user !== null) {
				return res
					.status(409)
					.json({ message: `The user with email: ${email} already exists` });
			}

			User.create(req.body).then(user =>
				res
					.json({ message: 'User created', data: user })
					.catch(err =>
						res.status(500).json({ message: 'Database error', error: err })
					)
			);
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.patch('/:id');

router.delete('/:id');
