const DB = require('../config/db.config');
const User = DB.User;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { AuthenticationError } = require('../errors/customErrors');

/**
 * Méthode de connexion
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Validation des données
		if (!email || !password) {
			throw new AuthenticationError('Bad credentials', 0);
		}

		let user = await User.findOne({
			where: { email: email },
			raw: true,
		});

		if (user === null) {
			throw new AuthenticationError("This account does'nt exist", 1);
		}

		// Vérification du mot de passe
		let passwordTest = await User.checkPassword(password, user.password);

		if (!passwordTest) {
			throw new AuthenticationError('Wrong password', 2);
		}

		let payload = {
			id: user.id,
			role: user.role,
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
		next(error);
	}
};
