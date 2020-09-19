require('dotenv').config();
const connection = require('../databaseConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Enregistrement de nouveaux utilisateurs
exports.signup = (req, res) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;

    // Vérification que l'email n'existe pas déjà dans la BDD
    const checkEmailExistsQuery = 'SELECT user_id FROM users WHERE email = ?';
    connection.query(checkEmailExistsQuery, [email], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        if (result.length > 0) return res.status(401).json({ error: 'Email already registered !' });

        // Appel la fonction de hachage de bcrypt dans notre mot de passe et lui
        // demandons de "saler" le mot de passe 10 fois = hachage plus sécurisé.
        bcrypt.hash(req.body.password, 10)
            // Création d'un nouvel utilisateur et enregistrement dans la BDD
            .then((hash) => {
                let signupQuery = `INSERT INTO users VALUES(NULL, ?, ?, ?, ?, ?, avatar_url, NOW())`;
                let queryValues = [firstName, lastName, username, email, hash];

                connection.query(signupQuery, queryValues, function(err) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    return res.status(201).json({ message: 'User created !' });
                });
            })
            .catch((error) => res.status(500).json({ error }));
    });
};

// Authentification d'un utilisateur
exports.signin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la BDD
    const findUserQuery = 'SELECT user_id, password FROM users WHERE email = ?';

    connection.query(findUserQuery, [email], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        if (result.length == 0) return res.status(401).json({ error: 'Bad connection informations !' });

        // La fonction compare de bcrypt permet de comparer le mot de passe entré
        // par l'utilisateur avec le hash enregistré dans la base de donnée
        bcrypt
            .compare(password, result[0].password)
            .then((valid) => {
                // S'ils ne correspondent pas, renvoie une erreur 401 Unauthorized
                // et un message "Password incorrect !"
                if (!valid) {
                    return res.status(401).json({ error: 'Bad connection informations !' });
                }
                // S'ils correspondent, les informations d'identification de notre utilisateur sont valides.
                // Dans ce cas, renvoie une réponse 200 contenant l'ID utilisateur et un token.
                return res.status(200).json({
                    token: jwt.sign({ userID: result[0].user_id }, process.env.JWT_TOKEN, { expiresIn: '30min' })
                });
            })
            .catch((error) => res.status(500).json({ error }));
    });
};