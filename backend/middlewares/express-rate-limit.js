const rateLimit = require('express-rate-limit');

module.exports = (req, res, next) => {
    // Possibilité de faire 100 tentatives de connexion par 24h
    const apiLimiter = rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
        max: 100,
        message: "You have exceeded the 100 requests in 24 hrs limit!",
        headers: true
    });
    next();
}