/**
 * Permet d'éviter à un utilisateur non authentifié d'ouvrir d'anciennes 
 * pages en cache qui contiennent des informations de connexion
 */
module.exports = function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}