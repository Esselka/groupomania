require('dotenv').config()
const jwt = require('jsonwebtoken');

/**
 * Vérification du TOKEN de l'utilisateur, si le seveur reconnait que le TOKEN a bien été créé par lui et
 * que le userID correspond alors valide la requête de l'utilisateur
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        res.locals.userID = decodedToken.userID;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid request, need to be auth !' });
    }
};