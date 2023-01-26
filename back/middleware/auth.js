// Jsonwebtoken permet de créer et vérifier les tokens d'authetification

const jwt = require('jsonwebtoken');

// Exportation du module lié au Token

module.exports = (req, res, next) => {
    try {

        // On récupère le Token après séparation par espace

        const token = req.headers.authorization.split(' ')[1];

        // On vérifie que le token de l'utilisateur correspondant à sa clé d'accès

        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        // On récupère le userId du Token décodé

        const userId = decodedToken.userId;

        // Gestion des erreurs possibles d'authentification

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant invalide';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Requête invalide')
        });
    }
};