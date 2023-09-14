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

exports.getAllFreezers = async (req, res, next) => {
	try {
		if (!req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		let freezers = await Freezer.findAll();
		return res.json({ data: freezers });
	} catch (error) {
		next(error);
	}
};

exports.getFreezerById = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
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
			throw new FreezerError('Freezer not found', 0);
		}

		if (freezer.user_id !== req.user_id && !req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		return res.json({ data: freezer });
	} catch (error) {
		next(error);
	}
};

exports.getFreezersByUserId = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		if (!userId) {
			throw new RequestError('Missing parameters');
		}

		if (req.user_id !== userId && !req.isAdmin) {
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
		next(error);
	}
};

exports.createFreezer = async (req, res, next) => {
	try {
		const { name, freezer_type_id, user_id } = req.body;

		if (!name || !freezer_type_id || !user_id) {
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

		return res.json({ message: 'Freezer created', data: newFreezer });
	} catch (error) {
		next(error);
	}
};

exports.updateFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			throw new RequestError('Missing parameters');
		}

		let freezer = await Freezer.findOne({
			where: { id: freezerId },
			raw: true,
		});

		if (freezer === null) {
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
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

		return res.json({ message: 'Freezer updated', data: updatedFreezer });
	} catch (error) {
		next(error);
	}
};

exports.trashFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			throw new RequestError('Missing parameters');
		}

		let freezer = Freezer.findOne({ where: { id: freezerId } });

		if (freezer === null) {
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
			throw new ForbiddenError('Forbidden');
		}

		// Soft delete du freezer
		await Freezer.destroy({ where: { id: freezerId } });

		return res.status(204).json({ message: 'Freezer soft deleted' });
	} catch (error) {
		next(error);
	}
};

exports.restoreFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			throw new RequestError('Missing parameters');
		}

		let freezer = Freezer.findOne({ where: { id: freezerId } });

		if (freezer === null) {
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
			throw new ForbiddenError('Forbidden');
		}

		await Freezer.restore({ where: { id: freezerId } });

		return res.status(204).json({ message: 'Freezer restored' });
	} catch (error) {
		next(error);
	}
};

exports.deleteFreezer = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			throw new RequestError('Missing parameters');
		}

		let freezer = Freezer.findOne({ where: { id: freezerId } });

		if (freezer === null) {
			throw new FreezerError('Freezer not found', 0);
		}

		if (req.user_id !== freezer.user_id) {
			throw new ForbiddenError('Forbidden');
		}

		// Supression du Freezer
		await Freezer.destroy({ where: { id: freezerId }, force: true });
		return res.status(204).json({ message: 'Freezer deleted' });
	} catch (error) {
		next(error);
	}
};
