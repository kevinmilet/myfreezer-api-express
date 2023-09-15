const DB = require('../config/db.config');
const FreezerType = DB.FreezerType;
const {
	RequestError,
	FreezerTypeError,
	ForbiddenError,
} = require('../errors/customErrors');

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
			throw new RequestError('Missing parameter');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
			raw: true,
		});

		if (freezerType === null) {
			throw new FreezerTypeError('Freezer type not found', 3);
		}

		return res.json({ data: freezerType });
	} catch (error) {
		next(error);
	}
};

exports.createFreezerType = async (req, res, next) => {
	try {
		if (!req.body.name) {
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
			throw new FreezerTypeError(
				`The freezer type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newFreezerType = await FreezerType.create(req.body);

		return res.json({ message: 'Freezer Type created', data: newFreezerType });
	} catch (error) {
		next(error);
	}
};

exports.updateFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			throw new RequestError('Missing parameter');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
			raw: true,
		});

		if (freezerType === null) {
			throw new FreezerTypeError('Freezer type not found', 3);
		} else if (
			freezerType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			throw new FreezerTypeError(
				`The freezer type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newFt = await FreezerType.update(req.body, { where: { id: id } });

		return res.json({ message: 'Freezer Type updated', data: newFt });
	} catch (error) {
		next(error);
	}
};

exports.deleteFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			throw new RequestError('Missing parameter');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
		});

		if (freezerType === null) {
			throw new FreezerTypeError('Freezer type not found', 3);
		}

		// Supression du freezer type
		await FreezerType.destroy({ where: { id: id }, force: true });

		return res.status(204).json({ message: 'Freezer Type deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.trashFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			throw new RequestError('Missing parameters');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
		});

		if (freezerType === null) {
			throw new FreezerTypeError('Freezer type not found', 3);
		}
		// Soft delete
		await reezerType.destroy({ where: { id: id } });
		return res.status(204).json({ message: 'Freezer type soft deleted' });
	} catch (error) {
		next(error);
	}
};

exports.untrashFreezerType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			throw new RequestError('Missing parameters');
		}

		let freezerType = await FreezerType.findOne({
			where: { id: id },
		});

		if (freezerType === null) {
			throw new FreezerTypeError('Freezer type not found', 3);
		}
		await FreezerType.restore({ where: { id: id } });
		return res.status(204).json({ message: 'Freezer type restored' });
	} catch (error) {
		next(error);
	}
};
