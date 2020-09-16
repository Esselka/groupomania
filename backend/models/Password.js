const passwordValidator = require('password-validator');

// Création d'un schéma pour définir les contraintes minimales que doit avoir un mot de passe
let schema = new passwordValidator();

// https://www.npmjs.com/package/password-validator#rules pour plus de règles
schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'M0t_de_passe']); // Blacklist these values

module.exports = schema;