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

			break;
		case 1:
			message = { message: error.message };
			break;
		case 2:
			message = { message: error.message, error: error };
			break;
		default:
			console.log('Bad debug level');
	}

	return res.status(error.statusCode || 500).json(message);
};

module.exports = errorHandler;
