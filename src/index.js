// Import des modules nécessaires
const express = require('express');
const cors = require('cors');

let DB = require('./config/db.config');

// Initialisation du serveur
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mise en place du routage
app.get('/', (req, res) => res.send(`I'm online. Welldone !!`));
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
