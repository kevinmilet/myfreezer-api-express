// Import des modules nécessaires
const { DataTypes } = require('sequelize');

// Définition du modèle
module.exports = sequelize => {
	const Product = sequelize.define(
		'Product',
		{
			id: {
				type: DataTypes.INTEGER(10),
				primaryKey: true,
				autoIncrement: true,
			},
			product_id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(100),
				defaultValue: '',
				allowNull: false,
			},
			freezer_id: {
				type: DataTypes.INTEGER(10),
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER(10),
				allowNull: false,
			},
			product_type_id: {
				type: DataTypes.INTEGER(10),
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER(10),
				allowNull: false,
				defaultValue: 0,
			},
			adding_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			paranoid: true,
		}
	);

	return Product;
};
