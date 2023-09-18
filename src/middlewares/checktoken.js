// Import des modules nécessaires
const jwt = require('jsonwebtoken');
const fs = require('fs');
const logger = require('../config/logger');

/**
 * Extraction du token
 * @date 4/22/2023 - 4:10:42 PM
 *
 * @param {*} authorization
 * @returns {*}
 */
const extractBearer = authorization => {
	if (typeof authorization !== 'string') {
		return false;
	}

	// Isolation du token
	const matches = authorization.match(/(bearer)\s+(\S+)/i);

	return matches && matches[2];
};

/**
 * Vérification de la présence du jwt_token
 * @date 4/22/2023 - 4:10:42 PM
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {*}
 */
const checkjwtTokenMiddleware = (req, res, next) => {
	const jwt_token =
		req.headers.authorization && extractBearer(req.headers.authorization);

	if (!jwt_token) {
		logger.error('401 - Non authorisé');
		return res.status(401).json({ message: 'Non authorisé' });
	}

	// Verification de la validité du token
	const secret = fs.readFileSync('./src/.certs/2603.pem');
	jwt.verify(jwt_token, secret, (err, decodedToken) => {
		if (err) {
			logger.error('401 - Bad Token');
			return res.status(401).json({ message: 'Bad token' });
		}

		// on récupére le payload et on stocke les valeurs dans la requête pour pouvoir les utiliser dans les controleurs
		req.user_id = decodedToken.id;
		req.isAdmin = decodedToken.role == 2016;

		next();
	});
};

module.exports = checkjwtTokenMiddleware;
