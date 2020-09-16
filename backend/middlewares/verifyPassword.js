const passwordSchema = require('../models/Password');

// Vérifie que le mot de passe respecte bien les contraintes fournies dans le schéma
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({
            error: 'Mot de passe pas assez fort !' + passwordSchema.validate(req.body.password, { list: true })
        });
    } else {
        next();
    }
}