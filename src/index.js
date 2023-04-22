// Import des modules nécessaires
const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

let DB = require('./config/db.config');

const checkjwtTokenMiddleware = require('./middlewares/checktoken');

// Config Swagger pour la documentation
const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Express API for My Freezer',
		version: '1.0.0',
		description:
			'This is a REST API application made with Express. It retrieves data for My Freezer.',
		contact: {
			name: 'Kevin Milet',
			url: 'https://www.kevin-milet.fr/',
		},
	},
	servers: [
		{
			url: 'http://localhost:8080',
			description: 'Development server',
		},
	],
};

const options = {
	swaggerDefinition,
	// Paths to files containing OpenAPI definitions
	apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Initialisation du serveur
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import de modules de routage
const user_router = require('./routes/users');
const freezerType_router = require('./routes/freezerTypes');
const freezer_router = require('./routes/freezers');
const productType_router = require('./routes/productTypes');
const product_router = require('./routes/products');
const auth_router = require('./routes/auth');

// Mise en place du routage
app.get('/', (req, res) => res.send(`I'm online. Welldone !!`));

app.use('/users', user_router);
app.use('/freezertypes', checkjwtTokenMiddleware, freezerType_router);
app.use('/freezers', checkjwtTokenMiddleware, freezer_router);
app.use('/producttypes', checkjwtTokenMiddleware, productType_router);
app.use('/products', checkjwtTokenMiddleware, product_router);

app.use('/auth', auth_router);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('*', (req, res) =>
	res.status(501).send('What the hell are you doing !?!')
);

// Démarage du serveur
DB.sequelize
	.authenticate()
	.then(() => console.log('Database connection OK'))
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(
				`This server is running on port ${process.env.PORT}. Have fun !!`
			);
		});
	})
	.catch(err => console.error('Database error', err));
