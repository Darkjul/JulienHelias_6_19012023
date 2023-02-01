// Constante qui appelle Express

const express = require("express");

// Express.Router permet de créer des gestionnaires de routes modulaires montables

const router = express.Router();

// On appelle les dépendances nécessaires au bon fonctionnement 

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauces");

// Configuration des routes spécifiques pour les sauces, l'authentification est requise sur chaque route

// Ajoute une sauce en méthode POST, on appelle multer pour gerer les images

router.post("/", auth, multer, sauceCtrl.createSauce);

// Affiche toutes les sauces de la Base De Données via méthode GET

router.get("/", auth, sauceCtrl.getAllSauces);

// Affiche une sauce spécifique via son ID toujours en méthode GET

router.get("/:id", auth, sauceCtrl.getOneSauce);

// Modifie une sauce en methode PUT, seul le créateur de la sauce est autorisé à le faire

router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// Suppression d'une sauce en methode DELETE, seul le créateur de la sauce est autorisé à le faire

router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Ajoute ou supprime un like à la sauce sélectionnée en méthode POST

router.post("/:id/like", auth, sauceCtrl.likeSauce);

// Exportation des routes

module.exports = router;