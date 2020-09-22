require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();

// Helmet aide à sécuriser une application Express en configurant différents en-tête HTTP (aide à la protection de faille XSS entre autre chose)
app.use(helmet());

// Permet d'accéder à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Permet de parser les requêtes envoyées par le client, on accède au body via 'req.body'
app.use(bodyParser.json());

// Permet de charger les images dans le dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Préfix des routes par défaut pour les requêtes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;