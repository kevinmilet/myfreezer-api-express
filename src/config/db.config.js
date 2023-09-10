const { Sequelize } = require('sequelize');

/**
 * Connexion à la BDD
 */
let sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'mysql',
		logging: false,
	}
);

/**
 * Mise en place des relations
 */
const db = {};

db.sequelize = sequelize;
db.User = require('../models/user')(sequelize);
db.Freezer = require('../models/freezer')(sequelize);
db.FreezerType = require('../models/freezer-type')(sequelize);
db.Product = require('../models/product')(sequelize);
db.ProductType = require('../models/product-type')(sequelize);

db.User.hasMany(db.Freezer, { foreignKey: 'user_id' });
db.Freezer.belongsTo(db.User, { foreignKey: 'user_id' });

db.FreezerType.hasMany(db.Freezer, { foreignKey: 'freezer_type_id' });
db.Freezer.belongsTo(db.FreezerType, { foreignKey: 'freezer_type_id' });

db.ProductType.hasMany(db.Product, { foreignKey: 'product_type_id' });
db.Product.belongsTo(db.ProductType, { foreignKey: 'product_type_id' });

db.User.hasMany(db.Product, { foreignKey: 'user_id' });
db.Product.belongsTo(db.User, { foreignKey: 'user_id' });

db.Freezer.hasMany(db.Product, { foreignKey: 'freezer_id' });
db.Product.belongsTo(db.Freezer, { foreignKey: 'freezer_id' });

/**
 * Synchro des modèles
 */
db.sequelize.sync(err => {
	console.log('Database Sync Error', err);
});
//db.sequelize.sync({ alter: true });

module.exports = db;
