const DB = require('../config/db.config');
const User = DB.User;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { AuthenticationError } = require('../errors/customErrors');
const logger = require('../config/logger');

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
			logger.error('501 - Bad credentials');
			throw new AuthenticationError('Bad credentials', 0);
		}

		let user = await User.findOne({
			where: { email: email },
			raw: true,
		});

		if (user === null) {
			logger.error("404 - Account does'nt exist");
			throw new AuthenticationError("This account does'nt exist", 1);
		}

		// Vérification du mot de passe
		let passwordTest = await User.checkPassword(password, user.password);

		if (!passwordTest) {
			logger.error('501 - Bad credentials');
			throw new AuthenticationError('Bad credentials', 2);
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

		logger.info(`User with login "${email}" has connected successfully`);

		return res.json({
			jwt_token: jwt_token,
		});
	} catch (error) {
		logger.error(error);
		next(error);
	}
};
