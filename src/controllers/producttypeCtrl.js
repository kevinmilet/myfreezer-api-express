const DB = require('../config/db.config');
const ProductType = DB.ProductType;

/**
 * Récupère tous les produits
 *
 * @param {*} req
 * @param {*} res
 */
exports.getAllProductTypes = (req, res) => {
	ProductType.findAll()
		.then(productType => res.json({ data: productType }))
		.catch(err => {
			res.status(500).json({ message: 'Database error', error: err });
		});
};

/**
 * Récupére un produit par son ID
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getProductTypeById = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let productType = await ProductType.findOne({
			where: { id: id },
			raw: true,
		});

		if (productType === null) {
			return res.status(404).json({ message: 'Product Type not found' });
		}

		return res.json({ data: productType });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

/**
 * Crée un produit
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createProductType = async (req, res) => {
	if (!req.body.name) {
		return res.status(400).json({ message: 'Missing data' });
	}

	try {
		let productType = await ProductType.findOne({
			where: { name: req.body.name.trim().toLowerCase() },
			raw: true,
		});

		if (
			productType !== null &&
			productType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			return res.status(409).json({
				message: `The product type '${req.body.name}' already exists`,
			});
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newPT = await ProductType.create(req.body);

		return res.json({ message: 'Product Type created', data: newPT });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

/**
 * Met à jour un produit
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateProductType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		let productType = await ProductType.findOne({
			where: { id: id },
			raw: true,
		});

		if (productType === null) {
			return res.status(404).json({ message: 'Product Type not found' });
		} else if (
			productType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			return res.status(409).json({
				message: `The product type '${req.body.name}' already exists`,
			});
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let updatedPT = await ProductType.update(req.body, { where: { id: id } });

		return res.json({ message: 'Product type updated', data: updatedPT });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

/**
 * Supprime un produit
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteProductType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		// Supression du Product type
		await ProductType.destroy({ where: { id: id }, force: true });

		return res.status(204).json({ message: 'Product type deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.trashProductType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		// Soft delete
		await ProductType.destroy({ where: { id: id } });
		return res.status(204).json({ message: 'Product type soft deleted' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};

exports.restoreProductType = async (req, res) => {
	let id = parseInt(req.params.id);

	if (!id) {
		return res.status(400).json({ message: 'Missing parameters' });
	}

	try {
		await ProductType.restore({ where: { id: id } });
		return res.status(204).json({ message: 'Product type restored' });
	} catch (error) {
		return res.status(500).json({ message: 'Database error', error: error });
	}
};
