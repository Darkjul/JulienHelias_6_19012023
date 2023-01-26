// Initialisation de Mongoose et son unique validator pour la gestion dans la base de données

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Fonction Schéma avec les champs email et password contenant l'objet et son type si il est requis ou requis et unique

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Exportation du model

module.exports = mongoose.model('User', userSchema);