const logger = require('../config/logger');

const errorHandler = (error, req, res, next) => {
	// 0 - message simple
	// 1 - message sans errors
	// 2 - Toutes les infos
	let debugLevel = 0;
	let message = {};

	switch (debugLevel) {
		case 0:
			message = { message: error.message };

			if (error.name == 'SequelizeDatabaseError') {
				message = { message: 'Database Error' };
			}

			logger.error(message);
			logger.error(error);

			break;
		case 1:
			message = { message: error.message };
			logger.error(message);
			logger.error(error);
			break;
		case 2:
			message = { message: error.message, error: error };
			logger.error(message);
			break;
		default:
			logger.warn('Bad debug level');
	}

	return res.status(error.statusCode || 500).json(message);
};

module.exports = errorHandler;
