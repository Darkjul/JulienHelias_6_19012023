// On importe le modèle Sauces

const Sauce = require("../models/Sauces");

// Package FS permettant la gestion de fichiers

const fs = require("fs");

// Création d'une sauce

exports.createSauce = (req, res, next) => {

    // Récuperation du formulaire de création de sauce en objet JS

    const sauceObject = JSON.parse(
        req.body.sauce
    );

    // Suppréssion de l'ID généré automatiquement

    delete sauceObject._id;

    // Copie de tous les éléments de sauceObject (Spread)

    const sauce = new Sauce({
        ...sauceObject,

        // Récupération de l'image et forçage des Likes et Dislikes à 0

        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce

        // Sauvegarde de la sauce crée

        .save()
        .then(() => res.status(201).json({ message: "Votre sauce a bien été crée !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Récupération de la liste de toutes les sauces de la BDD

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// Récupération d'une sauce dans la BDD par son ID

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

// Supprimer une sauce de la BDD via son ID

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {

            // Mesure de sécurité qui empêche un utlisiteur autre que le créateur de la sauce de la supprimer (Comparaison userID BDD et userID middleware Auth)

             if (req.auth.userId !== sauce.userId) {
                res.status(403).json({message: "Suppression de sauce non autorisée !"})
            }

            else {
                const filename = sauce.imageUrl.split("/images/")[1];
                Sauce.deleteOne({
                _id: req.params.id,
                })
                .then(() => {
                    fs.unlink(`images/${filename}`, () => {
                        res.status(200).json({ message: "Votre sauce a bien été supprimée !" });
                    });

                })
                     .catch((error) => res.status(400).json({ error }));
             }

        })
        .catch((error) => res.status(500).json({ error }));
};

// Modification d'une sauce de la BDD par son créateur

exports.modifySauce = (req, res, next) => {

    // On update les infos de la sauce concernée

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    } : { ...req.body };

    // Si la modification de la sauce concerne l'image 

    if (req.file) {

        // On identifie la sauce par son ID unique

        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {

                // On supprime son image et le lien entre l'ancienne image et la sauce concernée

                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlinkSync(`images/${filename}`);
            })
            .catch(error => res.status(500).json({ error }));
    }


    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Votre sauce a bien été modifiée !" }))
        .catch(error => res.status(400).json({ error }));
};

// Gestion des avis Like et Dislike des sauces

exports.likeSauce = (req, res, next) => {

    // On ajoute un Like ou un Dislike

    Sauce.findOne({ _id: req.params.id }).then((sauce) => {

        // Si l'utilisateur like une sauce

        if (req.body.like == 1 && !sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
                { _id: req.params.id },
                { // On incrémente de 1 les Likes et on push l'userID dans la liste usersLiked

                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId },
                }
            )
                .then(() =>
                    res.status(200).json({ message: "Vous avez liké cette sauce !" })
                )
                .catch((error) => res.status(400).json({ error }));
        }

        // Si l'utilisateur dislike une sauce

        else if (req.body.like == -1 && !sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
                { _id: req.params.id },
                { // On incrémente de 1 les Likes et on push l'userID dans la liste usersDisliked

                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId },
                }
            )
                .then(() =>
                    res.status(200).json({ message: "Vous avez disliké cette sauce !" })
                )
                .catch((error) => res.status(400).json({ error }));
        }

        // On retire un Like ou un Dislike si l'userID est déjà présent dans une des deux listes userLiked ou userDisliked

        else if (req.body.like == 0) {

            // Si l'userId est présent dans la liste usersLiked

            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne(
                    { _id: req.params.id, },
                    { // On retire le like de la sauce et l'utilisateur de la liste usersLiked

                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId },
                    }
                )
                    .then(() =>
                        res.status(200).json({ message: "Vous avez retiré votre like sur cette sauce !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }

            // Si l'userId est présent dans la liste usersDisliked

            else if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne(
                    { _id: req.params.id, },
                    { // On retire le dislike de la sauce et l'utilisateur de la liste usersDisliked

                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId },
                    }
                )
                    .then(() =>
                        res.status(200).json({ message: "Vous avez retiré votre dislike sur cette sauce !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }
        }

        else {
            res.status(400).json({ error: "Paramètres requis non valide" });
        }
    })
};