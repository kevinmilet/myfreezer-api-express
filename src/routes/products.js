// Import des modules nécessaires
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const DB = require('../config/db.config');
const Product = DB.Product;
const User = DB.User;
const Freezer = DB.Freezer;
const ProductType = DB.ProductType;

// Récupération du router d'express
let router = express.Router();

// Middleware pour logger les dates
router.use((req, res, next) => {
	const event = new Date();
	console.log('PRODUCT Time: ', event.toString());
	next();
});

// Routage de la ressource Product
router.get('', (req, res) => {
	Product.findAll()
		.then(products => res.json({ data: products }))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.get('/:id', (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	Product.findOne({
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
	})
		.then(product => {
			if (product === null) {
				return res.status(404).json({ message: 'Product not found' });
			}

			return res.json({ data: product });
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.put('', (req, res) => {
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

	const data = {
		name: '',
		product_id: '',
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
	data.product_id = uuidv4().toString().replace('-', '');

	Product.create(data)
		.then(product => res.json({ message: 'Product created', data: product }))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.patch('/:id', (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	Product.findOne({ where: { id: productId }, raw: true })
		.then(product => {
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

			Product.update(data, { where: { id: productId } })
				.then(product =>
					res.json({ message: 'Product updated', data: product })
				)
				.catch(err =>
					res.status(500).json({ message: 'Database error 1', error: err })
				);
		})
		.catch(err =>
			res.status(500).json({ message: 'Database error 2', error: err })
		);
});

router.delete('/:id', (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Supression du Product
	Product.destroy({ where: { id: productId }, force: true })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.delete('/trash/:id', (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	// Soft delete du Product
	Product.destroy({ where: { id: productId } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

router.post('/untrash/:id', (req, res) => {
	let productId = parseInt(req.params.id);

	if (!productId) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	Product.restore({ where: { id: productId } })
		.then(() => res.status(204).json({}))
		.catch(err =>
			res.status(500).json({ message: 'Database error', error: err })
		);
});

module.exports = router;
