// Import des modules nécessaires
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
			role: {
				type: DataTypes.INTEGER(4),
				defaultValue: '2007',
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

	User.beforeCreate(async (user, options) => {
		let hash = await bcrypt.hash(
			user.password.trim(),
			parseInt(process.env.BCRYPT_SALT_ROUND)
		);
		user.password = hash;
	});

	User.checkPassword = async (data, encrypted) => {
		return await bcrypt.compare(data, encrypted);
	};

	return User;
};
