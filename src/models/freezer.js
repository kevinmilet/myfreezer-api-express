// Import des modules nécessaires
const { DataTypes } = require('sequelize');

// Définition du modèle
module.exports = sequelize => {
	const Freezer = sequelize.define(
		'Freezer',
		{
			id: {
				type: DataTypes.INTEGER(10),
				primaryKey: true,
				autoIncrement: true,
			},
			freezer_id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(100),
				defaultValue: '',
				allowNull: false,
			},
			freezer_type_id: {
				type: DataTypes.INTEGER(10),
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER(10),
				allowNull: false,
			},
		},
		{
			paranoid: true,
		}
	);

	return Freezer;
};
