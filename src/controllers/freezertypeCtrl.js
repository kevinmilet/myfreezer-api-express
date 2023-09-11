// import des modules nécessaires
const DB = require('../config/db.config');
const FreezerType = DB.FreezerType;

exports.getAllFreezerTypes = async (req, res) => {
	try {
		let freezerType = await FreezerType.findAll();
		return res.json({ data: freezerType });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.getFreezerTypeById = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let freezerType = await FreezerType.findOne({
			where: { id: id },
			raw: true,
		});

		if (freezerType === null) {
			return res.status(404).json({ message: 'Freezer Type not found' });
		}

		return res.json({ data: freezerType });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.createFreezerType = async (req, res) => {
	if (!req.body.name) {
		return res.status(400).json({ message: 'Missing data' });
	}

	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		let freezerType = await FreezerType.findOne({
			where: { name: req.body.name.trim().toLowerCase() },
			raw: true,
		});

		if (
			freezerType !== null &&
			freezerType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			return res.status(409).json({
				message: `The freezer type '${req.body.name}' already exists`,
			});
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newFreezerType = await FreezerType.create(req.body);

		return res.json({ message: 'Freezer Type created', data: newFreezerType });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.updateFreezerType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		let freezerType = await FreezerType.findOne({
			where: { id: id },
			raw: true,
		});

		if (freezerType === null) {
			return res.status(404).json({ message: 'Freezer Type not found' });
		} else if (
			freezerType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			return res.status(409).json({
				message: `The freezer type '${req.body.name}' already exists`,
			});
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newFt = await FreezerType.update(req.body, { where: { id: id } });

		return res.json({ message: 'Freezer Type updated', data: newFt });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.deleteFreezerType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		// Supression du freezer type
		await FreezerType.destroy({ where: { id: id }, force: true });

		return res.status(204).json({ message: 'Freezer Type deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.trashFreezerType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		// Soft delete
		await reezerType.destroy({ where: { id: id } });
		return res.status(204).json({ message: 'Freezer type soft deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.untrashFreezerType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		await FreezerType.restore({ where: { id: id } });
		return res.status(204).json({ message: 'Freezer type restored' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};
