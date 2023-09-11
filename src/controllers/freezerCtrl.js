// Import des modules nécessaires
const DB = require('../config/db.config');
const Freezer = DB.Freezer;
const User = DB.User;
const FreezerType = DB.FreezerType;

exports.getAllFreezers = async (req, res) => {
	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		let freezers = await Freezer.findAll();
		return res.json({ data: freezers });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.getFreezerById = async (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
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
			return res.status(404).json({ message: 'Freezer not found' });
		}

		if (freezer.user_id !== req.user_id && !req.isAdmin) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		return res.json({ data: freezer });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.createFreezer = async (req, res) => {
	const { name, freezer_type_id, user_id } = req.body;

	if (!name || !freezer_type_id || !user_id) {
		return res.status(400).json({ message: 'Missing data' });
	}

	try {
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
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.updateFreezer = async (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let freezer = await Freezer.findOne({
			where: { id: freezerId },
			raw: true,
		});

		if (freezer === null) {
			return res.status(404).json({ message: 'Freezer not found' });
		}

		if (req.user_id !== freezer.user_id) {
			return res.status(403).json({ message: 'Forbidden' });
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
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.trashFreezer = async (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let freezer = Freezer.findOne({ where: { id: freezerId } });

		if (req.user_id !== freezer.user_id) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		// Soft delete du freezer
		await Freezer.destroy({ where: { id: freezerId } });

		return res.status(204).json({ message: 'Freezer soft deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.restoreFreezer = async (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let freezer = Freezer.findOne({ where: { id: freezerId } });

		if (req.user_id !== freezer.user_id) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		await Freezer.restore({ where: { id: freezerId } });

		return res.status(204).json({ message: 'Freezer restored' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.deleteFreezer = async (req, res) => {
	let freezerId = parseInt(req.params.id);

	if (!freezerId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let freezer = Freezer.findOne({ where: { id: freezerId } });

		if (req.user_id !== freezer.user_id) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		// Supression du Freezer
		await Freezer.destroy({ where: { id: freezerId }, force: true });
		return res.status(204).json({ message: 'Freezer deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.getFreezersByUserId = async (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (req.user_id !== userId && !req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
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
		return res.status(500).json({ message: 'Database error', error: error });
	}
};
