const { QueryTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const DB = require('../config/db.config');
const User = DB.User;
const validator = require('password-validator');
const {
	RequestError,
	UserError,
	ForbiddenError,
} = require('../errors/customErrors');
const logger = require('../config/logger');

const schema = new validator()
	.is()
	.min(8)
	.has()
	.uppercase()
	.has()
	.lowercase()
	.has()
	.digits()
	.has()
	.symbols()
	.has()
	.not()
	.spaces();

/**
 * Recupére tous les users
 */
exports.getAllUsers = async (req, res, next) => {
	try {
		let users = await User.findAll({
			attributes: [
				'id',
				'account_id',
				'firstname',
				'lastname',
				'email',
				'active',
				'role',
				'createdAt',
				'updatedAt',
				'deletedAt',
			],
		});
		return res.json({ data: users });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

/**
 * Recupére un user par son id
 */
exports.getUserById = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		if (!userId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let user = await User.findOne({
			where: { id: userId },
			attributes: [
				'id',
				'account_id',
				'firstname',
				'lastname',
				'email',
				'active',
				'role',
				'createdAt',
				'updatedAt',
				'deletedAt',
			],
		});

		if (user === null) {
			logger.error('404 - User not found');
			throw new UserError('User not found', 1);
		}

		return res.json({ data: user });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

/**
 * Crée un user
 */
exports.createUser = async (req, res, next) => {
	try {
		const { lastname, firstname, email, password } = req.body;

		const data = {
			firstname: '',
			lastname: '',
			email: '',
			password: '',
		};

		if (!lastname || !firstname || !email || !password) {
			logger.error('400 - Missing data');
			throw new RequestError('Missing data');
		}

		let verif = schema.validate(password.trim(), { details: true });

		if (verif.length != 0) {
			logger.error(verif);
			throw new RequestError(verif);
		}

		// Vérifie si l'user n'existe pas déjà
		let user = await User.findOne({ where: { email: email }, raw: true });

		if (user !== null) {
			logger.error(`404 - The user with email: ${email} already exists`);
			throw new UserError(`The user with email: ${email} already exists`, null);
		}

		// Remaping des datas
		data.firstname = firstname.trim().toLowerCase();
		data.lastname = lastname.trim().toLowerCase();
		data.email = email.trim().toLowerCase();

		// Création du user
		let newUser = await User.create(data);

		logger.info('User created');
		return res.json({ message: 'User created', data: newUser });
	} catch (error) {
		next(error);
	}
};

/**
 * Met à jour un user
 */
exports.updateUser = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		const data = {
			firstname: '',
			lastname: '',
			email: '',
		};

		if (!userId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		if (userId !== req.user_id && !req.isAdmin) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		let user = await User.findOne({ where: { id: userId }, raw: true });

		if (user === null) {
			logger.error('404 - User not found');
			throw new UserError('User not found', 1);
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

		logger.info('User updated');
		return res.json({ message: 'User updated', data: user });
	} catch (error) {
		next(error);
	}
};

/**
 * Supprime définitivement un user
 */
exports.deleteUser = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		if (!userId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		if (userId !== req.user_id && !req.isAdmin) {
			logger.error('403 Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		let user = User.findOne({ where: { id: userId } });

		if (user === null) {
			logger.error('404 - User not found');
			throw new UserError('User not found', 1);
		}

		await User.destroy({ where: { id: userId }, force: true });

		logger.info('User deleted');
		return res.status(204).json({ message: 'User deleted' });
	} catch (error) {
		next(error);
	}
};

/**
 * Soft delete  un user
 */
exports.trashUser = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		if (!userId) {
			logger.error('400 - Missing parameters');
			return res.status(400).json({ message: 'Missing parameters' });
		}

		if (userId !== req.user_id && !req.isAdmin) {
			logger.error('403 Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		let user = User.findOne({ where: { id: userId } });

		if (user === null) {
			logger.error('404 - User not found');
			throw new UserError('User not found', 1);
		}

		await User.destroy({ where: { id: userId } });

		logger.info('User desactivated');
		return res.status(204).json({ message: 'User desactivated' });
	} catch (error) {
		next(error);
	}
};

/**
 * Récupére un user soft deleted
 */
exports.untrashUser = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		if (!userId) {
			logger.error('400 - Missing parameters');
			return res.status(400).json({ message: 'Missing parameters' });
		}

		if (userId !== req.user_id && !req.isAdmin) {
			logger.error('403 Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		let user = User.findOne({ where: { id: userId } });

		if (user === null) {
			logger.error('404 - User not found');
			throw new UserError('User not found', 1);
		}

		await User.restore({ where: { id: userId } });

		logger.info('User restored');
		return res.status(204).json({ message: 'User restored' });
	} catch (error) {
		next(error);
	}
};

exports.searchUser = async (req, res, next) => {
	try {
		let search = req.body.search.trim().toLowerCase();

		if (!search) {
			return res.status(204);
		}

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
			logger.error('404 - User not found');
			throw new UserError('User not found', 1);
		}

		return res.json({ data: users });
	} catch (error) {
		next(error);
	}
};
