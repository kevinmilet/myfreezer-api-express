// Import des modules nécessaires
const jwt = require('jsonwebtoken');

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
		return res.status(401).json({ message: 'Non authorisé' });
	}

	// Verification de la validité du token
	jwt.verify(jwt_token, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			return res.status(401).json({ message: 'Bad token' });
		}
		next();
	});
};

module.exports = checkjwtTokenMiddleware;
