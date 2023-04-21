// Import des modules nécessaires
const express = require('express');
const { uuid } = require('uuidv4');
const bcrypt = require('bcrypt');
const DB = require('../config/db.config');
const User = DB.User;

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
	const { lastname, firstname, email, password } = req.body;

	if (!lastname || !firstname || !email || !password) {
		return res.status(400).json({ message: 'Missing data' });
	}

	// Vérifie si l'user n'existe pas déjà
	User.findOne({ where: { email: email }, raw: true })
		.then(user => {
			if (user !== null) {
				return res.status(409).json({
					message: `The user with email: ${email} already exists`,
				});
			}

			bcrypt
				.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
				.then(hash => {
					const data = {
						firstname: '',
						lastname: '',
						email: '',
						password: '',
						account_id: '',
					};

					data.password = hash;
					data.firstname = firstname.trim();
					data.lastname = lastname.trim();
					data.email = email.trim();
					data.account_id = uuid().toString().replace('-', '');

					User.create(data)
						.then(user => res.json({ message: 'User created', data: user }))
						.catch(err =>
							res.status(500).json({ message: 'Database error', error: err })
						);
				})
				.catch(err => res.status(500).json({ message: 'Unknown error' }));
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.patch('/:id', (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	User.findOne({ where: { id: userId }, raw: true })
		.then(user => {
			if (user === null) {
				return res.status(404).json({ message: 'User not found' });
			}

			const data = {
				firstname: '',
				lastname: '',
				email: '',
			};

			data.firstname =
				req.body.firstname != undefined
					? req.body.firstname.trim()
					: user.firstname;
			data.lastname =
				req.body.lastname != undefined
					? req.body.lastname.trim()
					: user.lastname;
			data.email =
				req.body.email != undefined ? req.body.email.trim() : user.email;

			User.update(data, { where: { id: userId } })
				.then(user => res.json({ message: 'User updated', data: user }))
				.catch(err =>
					res.status(500).json({ message: 'Database error 1', error: err })
				);
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error 2', error: err })
		);
});

router.delete('/:id', (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Supression du user
	User.destroy({ where: { id: userId }, force: true })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.delete('/trash/:id', (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Soft delete du user
	User.destroy({ where: { id: userId } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.post('/untrash/:id', (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	User.restore({ where: { id: userId } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

module.exports = router;
