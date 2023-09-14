const DB = require('../config/db.config');
const ProductType = DB.ProductType;
const {
	RequestError,
	ProductTypeError,
	ForbiddenError,
} = require('../errors/customErrors');

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
			throw new RequestError('Missing parameter');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
			raw: true,
		});

		if (productType === null) {
			throw new ProductTypeError('Product type not found', 4);
		}

		return res.json({ data: productType });
	} catch (error) {
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
			throw new RequestError('Missing data');
		}

		if (!req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		let productType = await ProductType.findOne({
			where: { name: req.body.name.trim().toLowerCase() },
			raw: true,
		});

		if (
			productType !== null &&
			productType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			throw new ProductTypeError(
				`The product type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let newPT = await ProductType.create(req.body);

		return res.json({ message: 'Product Type created', data: newPT });
	} catch (error) {
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
			throw new RequestError('Missing parameter');
		}

		if (!req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
			raw: true,
		});

		if (productType === null) {
			throw new ProductTypeError('Product type not found', 3);
		} else if (
			productType.name.toLowerCase() == req.body.name.trim().toLowerCase()
		) {
			throw new ProductTypeError(
				`The product type '${req.body.name}' already exists`,
				null
			);
		}

		// On nettoie et on formate le nom
		req.body.name = req.body.name.trim().toLowerCase();

		let updatedPT = await ProductType.update(req.body, { where: { id: id } });

		return res.json({ message: 'Product type updated', data: updatedPT });
	} catch (error) {
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
			throw new RequestError('Missing parameter');
		}

		if (!req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
		});

		if (productType === null) {
			throw new ProductTypeError('Product type not found', 3);
		}

		// Supression du Product type
		await ProductType.destroy({ where: { id: id }, force: true });

		return res.status(204).json({ message: 'Product type deleted' });
	} catch (error) {
		next(error);
	}
};

exports.trashProductType = async (req, res, next) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			throw new RequestError('Missing parameter');
		}

		if (!req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
		});

		if (productType === null) {
			throw new ProductTypeError('Product type not found', 3);
		}

		// Soft delete
		await ProductType.destroy({ where: { id: id } });
		return res.status(204).json({ message: 'Product type soft deleted' });
	} catch (error) {
		next(error);
	}
};

exports.restoreProductType = async (req, res) => {
	try {
		let id = parseInt(req.params.id);

		if (!id) {
			throw new RequestError('Missing parameter');
		}

		if (!req.isAdmin) {
			throw new ForbiddenError('Forbidden');
		}

		let productType = await ProductType.findOne({
			where: { id: id },
		});

		if (productType === null) {
			throw new ProductTypeError('Product type not found', 3);
		}

		await ProductType.restore({ where: { id: id } });
		return res.status(204).json({ message: 'Product type restored' });
	} catch (error) {
		next(error);
	}
};
