const bcrypt = require('bcrypt');
const DB = require('../config/db.config');
const User = DB.User;
const jwt = require('jsonwebtoken');
const fs = require('fs');

/**
 * Méthode de connexion
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.login = async (req, res) => {
	const { email, password } = req.body;

	// Validation des données
	if (!email || !password) {
		return res.status(400).json({ message: 'Bad request' });
	}

	try {
		let user = await User.findOne({
			where: { email: email },
			raw: true,
		});
		if (user === null) {
			return res.status(401).json({ message: "This account does'nt exist" });
		}

		// Vérification du mot de passe
		let passwordTest = await bcrypt.compare(password, user.password);

		if (!passwordTest) {
			return res.status(401).json({ message: 'Wrong password' });
		}

		let payload = {
			id: user.id,
			is_admin: user.is_admin,
			is_active: user.is_active,
		};

		// Génération du token
		const secret = fs.readFileSync('./src/.certs/1308.pem');
		const jwt_token = jwt.sign(payload, secret, {
			expiresIn: process.env.JWT_TTL,
			algorithm: 'RS256',
		});

		return res.json({
			jwt_token: jwt_token,
		});
	} catch (error) {
		if (error.name == 'SequelizeDatabaseError') {
			res.status(500).json({ message: 'Database Error', error: error });
		}
		res.status(500).json({ message: 'Login process failed', error: error });
	}
};
