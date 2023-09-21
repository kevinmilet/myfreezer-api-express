const DB = require('../config/db.config');
const ProductType = DB.ProductType;
const { RequestError, ProductTypeError } = require('../errors/customErrors');
const logger = require('../config/logger');

/**
 * Récupère tous les produits
 *
 * @param {*} req
 * @param {*} res
 */
exports.getAllProductTypes = async (req, res, next) => {
	try {
		let productType = await ProductType.findAll();
		return res.json({ data: productType });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

/**
 * Récupére un produit par son ID
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getProductTypeById = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameter');
			throw new RequestError('Missing parameter');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
			raw: true,
		});

		if (productType === null) {
			logger.error('404 - Product type not found');
			throw new ProductTypeError('Product type not found', 4);
		}

		return res.json({ data: productType });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

/**
 * Crée un produit
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createProductType = async (req, res, next) => {
	try {
		if (!req.body.name) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing data');
		}

		let productType = await ProductType.findOne({
			where: { name: req.body.name.trim().toLowerCase() },
			raw: true,
		});

		if (
			productType !== null &&
			productType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			logger.error(`409 - The product type '${req.body.name}' already exists`);
			throw new ProductTypeError(
				`The product type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newPT = await ProductType.create(req.body);
		logger.info('Type de produit créé');
		return res.json({ message: 'Product Type created', data: newPT });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

/**
 * Met à jour un produit
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateProductType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameter');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
			raw: true,
		});

		if (productType === null) {
			logger.error('404 - Product tpe not found');
			throw new ProductTypeError('Product type not found', 3);
		} else if (
			productType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			logger.error(`409 - The product type '${req.body.name}' already exists`);
			throw new ProductTypeError(
				`The product type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let updatedPT = await ProductType.update(req.body, { where: { id: id } });
		logger.info('Type de produit mis à jour');
		return res.json({ message: 'Product type updated', data: updatedPT });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

/**
 * Supprime un produit
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteProductType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameter');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
		});

		if (productType === null) {
			logger.error('404 - Product type not found');
			throw new ProductTypeError('Product type not found', 3);
		}

		// Supression du Product type
		await ProductType.destroy({ where: { id: id }, force: true });
		logger.info(`Le type de produit "${productType.name}" à été supprimé`);
		return res.status(204).json({ message: 'Product type deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.trashProductType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameter');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
		});

		if (productType === null) {
			logger.error('404 - Product type not found');
			throw new ProductTypeError('Product type not found', 3);
		}

		// Soft delete
		await ProductType.destroy({ where: { id: id } });
		logger.info(`Le type de produit "${productType.name}" à été désactivé`);
		return res.status(204).json({ message: 'Product type soft deleted' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};

exports.restoreProductType = async (req, res) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			logger.error('400 - Missing parameters');
			throw new RequestError('Missing parameter');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
		});

		if (productType === null) {
			logger.error('404 - Freezer type not found');
			throw new ProductTypeError('Product type not found', 3);
		}

		await ProductType.restore({ where: { id: id } });
		logger.info(`Le type de produit "${productType.name}" à été réactivé`);
		return res.status(204).json({ message: 'Product type restored' });
	} catch (error) {
		logger.error(error);
		next(error);
	}
};
