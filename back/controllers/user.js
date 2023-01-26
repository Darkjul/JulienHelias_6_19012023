// On appelle le fichier User dans le repertoire models

const User = require('../models/User');

// Package de chiffrement Bcrypt

const bcrypt = require('bcrypt');

// Jsonwebtoken permet de créer et vérifier les tokens d'authetification

const jwt = require('jsonwebtoken');

// Middleware Signup

exports.signup = (req, res, next) => {

    // On hache 10 fois le mot de passe dans son cryptage via Bcrypt 

    bcrypt.hash(req.body.password, 10)

        // On récupère le hash du mot de passe

        .then(hash => {

            // On crée le nouvel utilisateur en récupérant son email et son mot de passe haché crypté

            const signupUser = new User({
                email: req.body.email,
                password: hash
            });

            // On sauvegarde l'utilisateur crée

            signupUser.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Middleware Login

exports.login = (req, res, next) => {

    // On cherche dans la base de donnée l'émail de l'utilisateur

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {

                // On renverra une erreur si on ne trouve pas l'utilisateur

                return res.status(401).json({ error: 'Utilisateur et/ou mot de passe incorrect !' });
            }

            // On compare les entrées et les données de mot de passe

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {

                        // Si le mot de passe ne correspond pas on retourne une erreur

                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }

                    // Si tout est correct on retourne un objet avec les infos suivantes

                    res.status(200).json({

                        // ID Utilisateur

                        userId: user._id,

                        // Les données du Token que l'on veut encoder l'userID, la clé d'encodage et le temps d'expiration du Token

                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })

                // Gestion des erreurs possibles

                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};