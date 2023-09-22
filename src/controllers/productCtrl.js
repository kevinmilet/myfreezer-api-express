// Import des modules nécessaires
const { Op } = require('sequelize');
const DB = require('../config/db.config');
const Product = DB.Product;
const User = DB.User;
const Freezer = DB.Freezer;
const ProductType = DB.ProductType;
const {
	RequestError,
	ProductError,
	ForbiddenError,
} = require('../errors/customErrors');
const logger = require('../config/logger');

exports.getAllProducts = async (req, res, next) => {
	try {
		let products = await Product.findAll();
		return res.json({ data: products });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.getProductById = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			logger.error('400 - Missing parameter');
			throw new RequestError('Missing parameter');
		}

		let product = await Product.findOne({
			where: { id: productId },
			include: [
				{
					model: User,
					attributes: ['id', 'firstname', 'lastname', 'email', 'account_id'],
				},
				{
					model: Freezer,
					attributes: ['id', 'name'],
				},
				{
					model: ProductType,
					attributes: ['id', 'name'],
				},
			],
		});

		if (product === null) {
			logger.error('404 - Product not found');
			throw new ProductError('Product not found', 2);
		}

		if (product.user_id !== req.user_id && !req.isAdmin) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		return res.json({ data: product });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.getProductsByFreezerId = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let products = null;

		if (!req.isAdmin) {
			products = await Product.findAll({
				where: {
					freezer_id: freezerId,
					[Op.and]: [
						{
							user_id: req.user_id,
						},
					],
				},
				include: [
					{
						model: ProductType,
						attributes: ['id', 'name'],
					},
					{
						model: Freezer,
						attributes: ['id', 'name', 'user_id'],
					},
				],
			});
		} else {
			products = await Product.findAll({
				where: {
					freezer_id: freezerId,
				},
				include: [
					{
						model: ProductType,
						attributes: ['id', 'name'],
					},
					{
						model: Freezer,
						attributes: ['id', 'name', 'user_id'],
					},
				],
			});
		}

		return res.json({ data: products });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.getProductsByUserId = async (req, res, next) => {
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

		const products = await Product.findAll({
			where: { user_id: userId },
			include: [
				{
					model: ProductType,
					attributes: ['id', 'name'],
				},
				{
					model: Freezer,
					attributes: ['id', 'name'],
				},
			],
		});
		return res.json({ data: products });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.searchProduct = async (req, res, next) => {
	try {
		let search = req.body.search.trim().toLowerCase();

		if (!search) {
			return res.status(204);
		}

		let products = null;

		if (!req.isAdmin) {
			products = await Product.findAll({
				where: {
					name: {
						[Op.like]: `%${search}%`,
					},
					[Op.and]: [
						{
							user_id: req.user_id,
						},
					],
				},
				raw: true,
			});
		} else {
			products = await Product.findAll({
				where: {
					name: {
						[Op.like]: `%${search}%`,
					},
				},
				raw: true,
			});
		}

		if (products === null) {
			logger.error('404 - Product not found');
			throw new ProductError('Product not found', 2);
		}

		return res.json({ data: products });
	} catch (error) {
		next(error);
	}
};

exports.createProduct = async (req, res, next) => {
	try {
		const {
			name,
			freezer_id,
			user_id,
			product_type_id,
			adding_date,
			quantity,
		} = req.body;

		if (
			!name ||
			!freezer_id ||
			!user_id ||
			!product_type_id | !quantity | !adding_date
		) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing data');
		}

		const data = {
			name: '',
			freezer_id: null,
			user_id: null,
			product_type_id: '',
			quantity: null,
			adding_date: '',
		};

		data.name = name.trim().toLowerCase();
		data.product_type_id = product_type_id;
		data.user_id = user_id;
		data.freezer_id = freezer_id;
		data.quantity = quantity;
		data.adding_date = adding_date;

		let newProduct = await Product.create(data);
		logger.info('Produit ajouté');
		return res.json({ message: 'Product created', data: newProduct });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.updateProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			logger.error('403 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let product = await Product.findOne({
			where: { id: productId },
			raw: true,
		});

		if (product === null) {
			logger.error('404 - Product not found');
			throw new ProductError('Product not found', 2);
		}

		if (req.user_id !== product.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		const data = {
			name: '',
			product_type_id: null,
			freezer_id: null,
			quantity: null,
			adding_date: '',
		};

		data.name =
			req.body.name != undefined
				? req.body.name.trim().toLowerCase()
				: product.name;
		data.product_type_id =
			req.body.product_type_id != undefined
				? req.body.product_type_id
				: product_type_id;
		data.freezer_id =
			req.body.freezer_id != undefined
				? req.body.freezer_id
				: product.freezer_id;
		data.quantity =
			req.body.quantity != undefined ? req.body.quantity : product.quantity;
		data.adding_date =
			req.body.adding_date != undefined
				? req.body.adding_date
				: product.adding_date;

		let updatedProduct = await Product.update(data, {
			where: { id: productId },
		});

		logger.info('Produit mis à jour');
		return res.json({ message: 'Product updated', data: updatedProduct });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.deleteProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let product = await Product.findOne({
			where: { id: productId },
			raw: true,
		});

		if (product === null) {
			logger.error('404 - Product not found');
			throw new ProductError('Product not found', 2);
		}

		if (req.user_id !== product.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		// Supression du Product
		await Product.destroy({ where: { id: productId }, force: true });

		logger.info(`Le produit avec l'id "${productId}" a été supprimé`);

		return res.status(204).json({ message: 'Product deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.trashProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let product = Product.findOne({ where: { id: productId } });

		if (product === null) {
			logger.error('404 - Product not found');
			throw new ProductError('Product not found', 2);
		}

		if (req.user_id !== product.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		// Soft delete du Product
		await Product.destroy({ where: { id: productId } });
		logger.info(`Le produit "${product.name}" à été désactivé`);
		return res.status(204).json({ message: 'Product soft deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.restoreProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameters');
		}

		let product = Product.findOne({ where: { id: productId } });

		if (product === null) {
			logger.error('404 - Product not found');
			throw new ProductError('Product not found', 2);
		}

		if (req.user_id !== product.user_id) {
			logger.error('403 - Forbidden');
			throw new ForbiddenError('Forbidden');
		}

		await Product.restore({ where: { id: productId } });
		logger.info(`Le produit "${product.name}" à été restauré`);
		return res.status(204).json({ message: 'Product restored' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};
