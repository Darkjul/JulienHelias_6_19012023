// Installation des utilitaires pour travailler plus efficacement avec l'API

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// Chargement des variables d'environnement 

const dotenv = require('dotenv');
dotenv.config();

// On protège le back-end de certaines vulnerabilités en protégeant les en-têtes HTTP via HELMET

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// Utilisation par app des modules Cors et Express

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Création des constantes d'appel des fichiers user et sauces

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

// Connexion à la BDD via Mongoose

// Accès sécurisé à la BDD, les informations sensibles comme les identifiants de connexion ne sont pas affichés ici

mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    .then(() => console.log('La connexion à la base de données MongoDB à réussie !'))
    .catch(() => console.log('La connexion à la base de données MongoDB à échouée !'));

// On purge les données user pour éviter des injections malveillantes dans la BDD via Mongo Sanitize

app.use(mongoSanitize());

// Gestion des ressources images par Express de manière statique

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes attendues par le front-end pour user et sauces

app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

// Exportation de app pour y acceder depuis d'autres fichiers du backend

module.exports = app; 