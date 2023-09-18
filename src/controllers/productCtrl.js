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

exports.getAllProducts = async (req, res, next) => {
	try {
		let products = await Product.findAll();
		return res.json({ data: products });
	} catch (error) {
		next(error);
	}
};

exports.getProductById = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
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
			throw new ProductError('Product not found', 2);
		}

		if (product.user_id !== req.user_id && !req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		return res.json({ data: product });
	} catch (error) {
		next(error);
	}
};

// TODO: verifier que l'user connecté à le droit d'afficher les produits de ce congel ou que l'user est admin
exports.getProductsByFreezerId = async (req, res, next) => {
	try {
		let freezerId = parseInt(req.params.id);

		if (!freezerId) {
			throw new RequestError('Missing parameters');
		}

		const products = await Product.findAll({
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

		return res.json({ data: products });
	} catch (error) {
		next(error);
	}
};

exports.getProductsByUserId = async (req, res, next) => {
	try {
		let userId = parseInt(req.params.id);

		if (!userId) {
			throw new RequestError('Missing parameters');
		}

		if (req.user_id !== userId && !req.isAdmin) {
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
		next(error);
	}
};

exports.searchProduct = async (req, res, next) => {
	try {
		// TODO: verifier que les produits retournés appartiennent à cet user ou que l'user est admin
		let search = req.body.search.trim().toLowerCase();

		if (!search) {
			return res.status(204);
		}

		const products = await Product.findAll({
			where: {
				name: {
					[Op.like]: `%${search}%`,
				},
			},
			raw: true,
		});

		if (products === null) {
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
		return res.json({ message: 'Product created', data: newProduct });
	} catch (error) {
		next(error);
	}
};

exports.updateProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			throw new RequestError('Missing parameters');
		}

		let product = await Product.findOne({
			where: { id: productId },
			raw: true,
		});

		if (product === null) {
			throw new ProductError('Product not found', 2);
		}

		if (req.user_id !== product.user_id) {
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

		return res.json({ message: 'Product updated', data: updatedProduct });
	} catch (error) {
		next(error);
	}
};

exports.deleteProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			throw new RequestError('Missing parameters');
		}

		let product = Product.findOne({ where: { id: productId }, raw: true });

		if (product === null) {
			throw new ProductError('Product not found', 2);
		}
		console.log(product.freezer_id);
		console.log(req.user_id, product.user_id);
		if (req.user_id !== product.user_id) {
			throw new ForbiddenError('Forbidden');
		}

		// Supression du Product
		await Product.destroy({ where: { id: productId }, force: true });
		return res.status(204).json({ message: 'Product deleted' });
	} catch (error) {
		next(error);
	}
};

exports.trashProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			throw new RequestError('Missing parameters');
		}

		let product = Product.findOne({ where: { id: productId } });

		if (product === null) {
			throw new ProductError('Product not found', 2);
		}

		if (req.user_id !== product.user_id) {
			throw new ForbiddenError('Forbidden');
		}

		// Soft delete du Product
		await Product.destroy({ where: { id: productId } });
		return res.status(204).json({ message: 'Product soft deleted' });
	} catch (error) {
		next(error);
	}
};

exports.restoreProduct = async (req, res, next) => {
	try {
		let productId = parseInt(req.params.id);

		if (!productId) {
			throw new RequestError('Missing parameters');
		}

		let product = Product.findOne({ where: { id: productId } });

		if (product === null) {
			throw new ProductError('Product not found', 2);
		}

		if (req.user_id !== product.user_id) {
			throw new ForbiddenError('Forbidden');
		}

		await Product.restore({ where: { id: productId } });
		return res.status(204).json({ message: 'Product restored' });
	} catch (error) {
		next(error);
	}
};
