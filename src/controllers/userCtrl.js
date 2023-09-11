const { QueryTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const DB = require('../config/db.config');
const User = DB.User;

/**
 * Recupére tous les users
 */
exports.getAllUsers = async (req, res) => {
	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		let users = await User.findAll();
		return users;
	} catch (error) {
		res.status(500).json({ message: 'Database error', error: error });
	}
};

/**
 * Recupére un user par son id
 */
exports.getUserById = async (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		let user = await User.findOne({ where: { id: userId }, raw: true });

		if (user === null) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.json({ data: user });
	} catch (error) {
		res.status(500).json({ message: 'Database error', error: error });
	}
};

/**
 * Crée un user
 */
exports.createUser = async (req, res) => {
	const { lastname, firstname, email, password } = req.body;

	const data = {
		firstname: '',
		lastname: '',
		email: '',
		password: '',
	};

	if (!lastname || !firstname || !email || !password) {
		return res.status(400).json({ message: 'Missing data' });
	}

	try {
		// Vérifie si l'user n'existe pas déjà
		let user = await User.findOne({ where: { email: email }, raw: true });

		if (user !== null) {
			return res.status(409).json({
				message: `The user with email: ${email} already exists`,
			});
		}

		// Hashage du mot de passe
		let hash = await bcrypt.hash(
			password,
			parseInt(process.env.BCRYPT_SALT_ROUND)
		);

		// Remaping des datas
		data.password = hash;
		data.firstname = firstname.trim().toLowerCase();
		data.lastname = lastname.trim().toLowerCase();
		data.email = email.trim().toLowerCase();

		// Création du user
		let newUser = await User.create(data);

		return res.json({ message: 'User created', data: newUser });
	} catch (error) {
		console.log(error);
		if (error.name == 'SequelizeDatabaseError') {
			res.status(500).json({ message: 'Database Error', error: error });
		}
		res.status(500).json({ message: 'Unknown error' });
	}
};

/**
 * Met à jour un user
 */
exports.updateUser = async (req, res) => {
	let userId = parseInt(req.params.id);

	const data = {
		firstname: '',
		lastname: '',
		email: '',
	};

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (userId !== req.user_id && !req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		let user = await User.findOne({ where: { id: userId }, raw: true });

		if (user === null) {
			return res.status(404).json({ message: 'User not found' });
		}

		data.firstname =
			req.body.firstname != undefined
				? req.body.firstname.trim().toLowerCase()
				: user.firstname;
		data.lastname =
			req.body.lastname != undefined
				? req.body.lastname.trim().toLowerCase()
				: user.lastname;
		data.email =
			req.body.email != undefined
				? req.body.email.trim().toLowerCase()
				: user.email;

		await User.update(data, { where: { id: userId } });

		return res.json({ message: 'User updated', data: user });
	} catch (error) {
		return res.status(500).json({ message: 'Database error 1', error: error });
	}
};

/**
 * Supprime définitivement un user
 */
exports.deleteUser = async (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (userId !== req.user_id && !req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		await User.destroy({ where: { id: userId }, force: true });

		return res.status(204).json({ message: 'User deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

/**
 * Soft delete  un user
 */
exports.trashUser = async (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (userId !== req.user_id && !req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		await User.destroy({ where: { id: userId } });

		return res.status(204).json({ message: 'User soft deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

/**
 * Récupére un user soft deleted
 */
exports.untrashUser = async (req, res) => {
	let userId = parseInt(req.params.id);

	if (!userId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	if (userId !== req.user_id && !req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		await User.restore({ where: { id: userId } });

		return res.status(204).json({ message: 'User restored' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.searchUser = async (req, res) => {
	let search = req.body.search.trim().toLowerCase();

	if (!search) {
		return res.status(204);
	}

	if (!req.isAdmin) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		const users = await User.findAll({
			where: {
				[Op.or]: [
					{
						firstname: {
							[Op.like]: `%${search}%`,
						},
					},
					{
						lastname: {
							[Op.like]: `%${search}%`,
						},
					},
					{
						email: {
							[Op.like]: `%${search}%`,
						},
					},
				],
			},
			raw: true,
		});

		if (users === null) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.json({ data: users });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};
