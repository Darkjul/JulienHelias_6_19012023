// Jsonwebtoken permet de créer et vérifier les tokens d'authentification

const jwt = require('jsonwebtoken');

// Exportation du module lié au Token

module.exports = (req, res, next) => {
    try {

        // On récupère le Token après séparation par espace

        const token = req.headers.authorization.split(' ')[1];

        // On vérifie que le token de l'utilisateur correspondant à sa clé d'accès

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_RANDOM);

        // On récupère le userId du Token décodé

        const userId = decodedToken.userId;

        // Gestion des erreurs possibles d'authentification        

        // Si L'User ID du corps de la requête est différent du userID --> Renvoi d'une erreur

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant invalide';
        } else {
            req.auth = { userId };
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Requête invalide')
        });
    }
};