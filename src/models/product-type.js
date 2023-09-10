// Import des modules nécessaires
const { DataTypes } = require('sequelize');

// Définition du modèle
module.exports = sequelize => {
	const ProductType = sequelize.define(
		'ProductType',
		{
			id: {
				type: DataTypes.INTEGER(10),
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING(100),
				defaultValue: '',
				allowNull: false,
			},
		},
		{
			paranoid: true,
		}
	);

	return ProductType;
};
