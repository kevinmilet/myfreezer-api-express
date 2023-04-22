// Import des modules nécessaires
const express = require('express');
const bcrypt = require('bcrypt');
const DB = require('../config/db.config');
const User = DB.User;
const jwt = require('jsonwebtoken');

// Récupération du router d'express
let router = express.Router();

// Middleware pour logger les dates
router.use((req, res, next) => {
	const event = new Date();
	console.log('AUTH Time: ', event.toString());
	next();
});

// Routage de la ressource Auth
router.post('/login', (req, res) => {
	const { email, password } = req.body;

	// Validation des données
	if (!email || !password) {
		return res.status(400).json({ message: 'Bad request' });
	}

	User.findOne({ where: { email: email }, raw: true })
		.then(user => {
			if (user === null) {
				return res.status(401).json({ message: "This account does'nt exist" });
			}

			// Vérification du mot de passe
			bcrypt
				.compare(password, user.password)
				.then(test => {
					if (!test) {
						return res.status(401).json({ message: 'Wrong password' });
					}

					// Génération du token
					const jwt_token = jwt.sign(
						{
							id: user.id,
							firstname: user.firstname,
							lastname: user.lastname,
							email: user.email,
							account_id: user.account_id,
						},
						process.env.JWT_SECRET,
						{ expiresIn: process.env.JWT_TTL }
					);

					return res.json({ jwt_toekn: jwt_token });
				})
				.catch(err =>
					res.status(500).json({ message: 'Login process failed' })
				);
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

module.exports = router;
