// Constante qui appelle Express

const express = require('express');

// Express.Router permet de créer des gestionnaires de routes modulaires montables

const router = express.Router();

// On appelle le fichier user dans le repertoire controllers

const userCtrl = require('../controllers/user');

// Routes pour créer ou se connecter au compte

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation des routes

module.exports = router;