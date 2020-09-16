require('dotenv').config();
const mysql = require('mysql');

// Connexion à mysql
const connection = mysql.createPool({
    host: 'localhost',
    port: '3307',
    database: 'groupomania',
    user: 'user',
    password: 'Projet7_OC'
});

module.exports = connection;