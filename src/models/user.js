// Import des modules nécessaires
const { DataTypes } = require('sequelize');

// Définition du modèle
module.exports = sequelize => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER(10),
				primaryKey: true,
				autoIncrement: true,
			},
			account_id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			firstname: {
				type: DataTypes.STRING(100),
				defaultValue: '',
				allowNull: false,
			},
			lastname: {
				type: DataTypes.STRING(100),
				defaultValue: '',
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING(64),
				is: /^[0-9a-f]{64}$/i,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
			is_admin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			password_request: {
				type: DataTypes.BOOLEAN,
			},
			token_request: {
				type: DataTypes.STRING(255),
			},
		},
		{
			paranoid: true,
		}
	);

	return User;
};
