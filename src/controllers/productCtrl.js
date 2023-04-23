// Import des modules nécessaires
const DB = require('../config/db.config');
const Product = DB.Product;
const User = DB.User;
const Freezer = DB.Freezer;
const ProductType = DB.ProductType;

exports.getAllProducts = (req, res) => {
	Product.findAll()
		.then(products => res.json({ data: products }))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
};

exports.getProductById = async (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
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
			return res.status(404).json({ message: 'Product not found' });
		}

		return res.json({ data: product });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.createProduct = async (req, res) => {
	const { name, freezer_id, user_id, product_type_id, adding_date, quantity } =
		req.body;

	if (
		!name ||
		!freezer_id ||
		!user_id ||
		!product_type_id | !quantity | !adding_date
	) {
		return res.status(400).json({ message: 'Missing data' });
	}

	try {
		const data = {
			name: '',
			freezer_id: null,
			user_id: null,
			product_type_id: '',
			quantity: null,
			adding_date: '',
		};

		let str = name.toString().trim();

		data.name = str[0].toUpperCase() + str.slice(1).toLowerCase();
		data.product_type_id = product_type_id;
		data.user_id = user_id;
		data.freezer_id = freezer_id;
		data.quantity = quantity;
		data.adding_date = adding_date;

		let newProduct = await Product.create(data);
		return res.json({ message: 'Product created', data: newProduct });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.updateProduct = async (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let product = await Product.findOne({
			where: { id: productId },
			raw: true,
		});

		if (product === null) {
			return res.status(404).json({ message: 'Product not found' });
		}

		const data = {
			name: '',
			product_type_id: null,
			freezer_id: null,
			quantity: null,
			adding_date: '',
		};

		data.name =
			req.body.name != undefined ? req.body.name.trim() : product.name;
		data.product_type_id =
			req.body.freezer_type_id != undefined
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
		return res.status(500).json({ message: 'Database error 2', error: error });
	}
};

exports.deleteProduct = async (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		// Supression du Product
		await Product.destroy({ where: { id: productId }, force: true });
		return res.status(204).json({ message: 'Product deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.trashProduct = async (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		// Soft delete du Product
		await Product.destroy({ where: { id: productId } });
		return res.status(204).json({ message: 'Product soft deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.restoreProduct = async (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		await Product.restore({ where: { id: productId } });
		return res.status(204).json({ message: 'Product restored' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};
