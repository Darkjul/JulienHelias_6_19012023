// Initialisation de Multer qui permet de gérer les fichiers entrants via les requêtes HTTP.

const multer = require('multer');

// Gestion des extensions possibles pour les types de fichiers, ici des images

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

// On enregistre les images envoyées par l'utilisateur connecté dans un stockage définit, ici on stocke dans le dossier images

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    // On créer le nom du fichier avec ses paramêtres dédiés et Callback renvoi ensuite le nom du fichier final avec son extension

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Export de Multer pour signifié que le fichier est unique et qu'il est exclusivement une image

module.exports = multer({ storage: storage }).single('image');