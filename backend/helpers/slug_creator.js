// Fonction qui crée un slug d'une longueur de 25 caractères qui servira d'identification pour chaque post dans l'URL
// Exemple : https://mon-site.fr/BwnTwoB-Ach@fVhCqGgmVpSiv
exports.makeSlug = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_$-&';
    var charactersLength = characters.length;
    for (var i = 0; i < 25; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};