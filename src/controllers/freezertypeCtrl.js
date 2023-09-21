const DB = require('../config/db.config');
const FreezerType = DB.FreezerType;
const { RequestError, FreezerTypeError } = require('../errors/customErrors');
const logger = require('../config/logger');

exports.getAllFreezerTypes = async (req, res, next) => {
	try {
		let freezerType = await FreezerType.findAll();
		return res.json({ data: freezerType });
	} catch (error) {
		next(error);
	}
};

exports.getFreezerTypeById = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameter');
			throw new RequestError('Missing parameter');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
			raw: true,
		});

		if (freezerType === null) {
			logger.error('404 - Freezer type not found');
			throw new FreezerTypeError('Freezer type not found', 3);
		}

		return res.json({ data: freezerType });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.createFreezerType = async (req, res, next) => {
	try {
		if (!req.body.name) {
			logger.error('400 - Missing parameter');
			throw new RequestError('Missing data');
		}

		let freezerType = await FreezerType.findOne({
			where: { name: req.body.name.trim().toLowerCase() },
			raw: true,
		});

		if (
			freezerType !== null &&
			freezerType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			logger.error(`409 - The freezer type '${req.body.name}' already exists`);
			throw new FreezerTypeError(
				`The freezer type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newFreezerType = await FreezerType.create(req.body);
		logger.info('Type de congélateur créé');
		return res.json({ message: 'Freezer Type created', data: newFreezerType });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.updateFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameter');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
			raw: true,
		});

		if (freezerType === null) {
			logger.error('404 - Freezer type not found');
			throw new FreezerTypeError('Freezer type not found', 3);
		} else if (
			freezerType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			logger.error(`409 - The freezer type '${req.body.name}' already exists`);
			throw new FreezerTypeError(
				`The freezer type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newFt = await FreezerType.update(req.body, { where: { id: id } });
		logger.info('Type de congélateur mis à jour');
		return res.json({ message: 'Freezer Type updated', data: newFt });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.deleteFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameter');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
		});

		if (freezerType === null) {
			logger.error('404 - Freezer type not found');
			throw new FreezerTypeError('Freezer type not found', 3);
		}

		// Supression du freezer type
		await FreezerType.destroy({ where: { id: id }, force: true });
		logger.info(`Le type de congélateur "${freezerType.name}" à été supprimé`);
		return res.status(204).json({ message: 'Freezer Type deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.trashFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
		});

		if (freezerType === null) {
			logger.error('404 - Freezer type not found');
			throw new FreezerTypeError('Freezer type not found', 3);
		}
		// Soft delete
		await FreezerType.destroy({ where: { id: id } });
		logger.info(`Le type de congélateur "${freezerType.name}" à été désactivé`);
		return res.status(204).json({ message: 'Freezer type soft deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.untrashFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
		});

		if (freezerType === null) {
			logger.error('404 - Freezer type not found');
			throw new FreezerTypeError('Freezer type not found', 3);
		}

		await FreezerType.restore({ where: { id: id } });
		logger.info(`Le type de congélateur "${freezerType.name}" à été réactivé`);
		return res.status(204).json({ message: 'Freezer type restored' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};
