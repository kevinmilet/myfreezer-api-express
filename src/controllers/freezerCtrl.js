// Import des modules nécessaires
const DB = require('../config/db.config');
const Freezer = DB.Freezer;
const User = DB.User;
const FreezerType = DB.FreezerType;
const {
	RequestError,
	FreezerError,
	ForbiddenError,
} = require('../errors/customErrors');
const logger = require('../config/logger');

exports.getAllFreezers = async (req, res, next) => {
	try {
		let freezers = await Freezer.findAll();
		return res.json({ data: freezers });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.getFreezerById = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			logger.error('400 - Missing parameter');
			throw new RequestError('Missing parameter');
		}

		let freezer = await Freezer.findOne({
			where: { id: freezerId },
			include: [
				{
					model: User,
					attributes: ['id', 'firstname', 'lastname', 'email', 'account_id'],
				},
				{
					model: FreezerType,
					attributes: ['id', 'name'],
				},
			],
		});

		if (freezer === null) {
			logger.error('404 - Freezer not found');
			throw new FreezerError('Freezer not found', 0);
		}

		if (freezer.user_id !== req.user_id && !req.isAdmin) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		return res.json({ data: freezer });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.getFreezersByUserId = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		if (!userId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		if (req.user_id !== userId && !req.isAdmin) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		const freezers = await Freezer.findAll({
			where: { user_id: userId },
			include: [
				{
					model: FreezerType,
					attributes: ['id', 'name'],
				},
			],
		});

		return res.json({ data: freezers });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.createFreezer = async (req, res, next) => {
	try {
		const { name, freezer_type_id, user_id } = req.body;

		if (!name || !freezer_type_id || !user_id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing data');
		}

		const data = {
			name: '',
			freezer_type_id: null,
			user_id: null,
		};

		data.name = name.trim().toLowerCase();
		data.freezer_type_id = freezer_type_id;
		data.user_id = user_id;

		let newFreezer = await Freezer.create(data);

		logger.info('Congélateur créé');

		return res.json({ message: 'Freezer created', data: newFreezer });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.updateFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			logger.error('403 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let freezer = await Freezer.findOne({
			where: { id: freezerId },
			raw: true,
		});

		if (freezer === null) {
			logger.error('404 - Freezer not found');
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		const data = {
			name: '',
			freezer_type_id: 0,
		};

		data.name =
			req.body.name != undefined
				? req.body.name.trim().toLowerCase()
				: freezer.name;
		data.freezer_type_id =
			req.body.freezer_type_id != undefined
				? req.body.freezer_type_id
				: freezer.freezer_type_id;

		let updatedFreezer = await Freezer.update(data, {
			where: { id: freezerId },
		});

		logger.info('Congélateur mis à jour');

		return res.json({ message: 'Freezer updated', data: updatedFreezer });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.trashFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let freezer = await Freezer.findOne({ where: { id: freezerId } });

		if (freezer === null) {
			logger.error('404 - Freezer not found');
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		// Soft delete du freezer
		await Freezer.destroy({ where: { id: freezerId } });

		logger.info(`Le congélateur "${freezer.name}" à été désactivé`);

		return res.status(204).json({ message: 'Freezer soft deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.restoreFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let freezer = await Freezer.findOne({ where: { id: freezerId } });

		if (freezer === null) {
			logger.error('404 - Freezer not found');
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		await Freezer.restore({ where: { id: freezerId } });

		logger.info(`Le congélateur "${freezer.name}" à été réactivé`);

		return res.status(204).json({ message: 'Freezer restored' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.deleteFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let freezer = await Freezer.findOne({ where: { id: freezerId } });

		if (freezer === null) {
			logger.error('404 - Freezer not found');
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		// Supression du Freezer
		await Freezer.destroy({ where: { id: freezerId }, force: true });

		logger.info(`Le congélateur "${freezer.name}" à été supprimé`);

		return res.status(204).json({ message: 'Freezer deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};
