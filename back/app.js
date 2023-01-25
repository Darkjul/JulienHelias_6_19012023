// Installation des utilitaires pour travailler plus efficacement avec l'API

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');

// Chargement des variables d'environnement 

const dotenv = require('dotenv');
dotenv.config();

// Utilisation par app des modules Cors et Express

app.use(cors());
app.use(express.json());

// Création des constantes d'appel du fichier user

const userRoutes = require("./routes/user");

// Connexion à la BDD via Mongoose

// Accès sécurisé à la BDD, les informations sensibles comme les identifiants de connexion ne sont pas affichés ici

mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    .then(() => console.log('La connexion à la base de données MongoDB à réussie !'))
    .catch(() => console.log('La connexion à la base de données MongoDB à échouée !'));

// Middleware qui filtre les échanges entre le front et le back et ajoute des headers aux requêtes    

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Gestion des ressources images par Express de manière statique

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes attendues par le front-end pour user

app.use("/api/auth", userRoutes);

// Exportation de app pour y acceder depuis d'autres fichiers du backend

module.exports = app; 