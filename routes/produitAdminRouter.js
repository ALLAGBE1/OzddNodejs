const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ProduitsAdmin = require('../models/produitsAdmin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const produitAdminRouter = express.Router();
produitAdminRouter.use(bodyParser.json());

// :::::::::::::::::::::::
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/imagesProduits'); // Définit le répertoire de stockage
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Définit le nom du fichier
    }
  });
  
  const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Vous ne pouvez télécharger que des fichiers pdf !'), false);
    }
    cb(null, true);
  };
  
const upload = multer({ storage: storage, fileFilter: imageFileFilter });
// ::::::::::::::::::::::

produitAdminRouter.route('/')
    .get((req, res, next) => {
        ProduitsAdmin.find(req.query)
        .populate('categorie')
        .then((produits) => {
            const transformedProducts = produits.map(produit => {
                produit = produit.toObject();

                let imageName = produit.image;
                produit.afficheUrl = `${imageName}`;
                return produit;
            })

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transformedProducts); // Utilisez les données transformées
        })
        .catch((err) => next(err));
    });

produitAdminRouter.get('/images/:imageName', (req, res, next) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/imagesProduits', imageName);

    // Vérifiez que le fichier image existe
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})


produitAdminRouter.route('/')
    .post(upload.single('image'), async (req, res, next) => {
        try {
            console.log("zzzzzzzzzzzzzzzzzzzz");
            const { titre, description, prix, apercu, categorie } = req.body;
            // const imageUrl = `${req.protocol}://${req.get('host')}/produitsAdmin/${req.file.originalname}`;
            const imageUrl = `https://ozdd.onrender.com/produitsAdmin/${req.file.originalname}`;
            console.log("bbbbbbbbbbbbbbbbbbbbb");
            // console.log("aaaaaaaaaaaaaaaa", imageUrl);

            const produit = await ProduitsAdmin.create({
                titre: titre,
                description: description,
                image: imageUrl,
                prix: prix,
                apercu: apercu,
                categorie: categorie
            });

            console.log("Produit Créé :", produit);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(produit);
        } catch (err) {
            console.error("Erreur lors de la création du produit :", err);
            res.status(500).json({ error: err.message || "Une erreur est survenue lors de la création du produit." });
        }
    });


produitAdminRouter.route('/')
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Opération PUT non prise en charge sur /Produits/');
    })

produitAdminRouter.route('/')
    .delete((req, res, next) => {
        ProduitsAdmin.deleteMany({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));    
    });


produitAdminRouter.route('/produit/:produitId')
.get((req, res, next) => {
    ProduitsAdmin.findById(req.params.produitId)
    .then((produit) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(produit);
    })
    .catch((err) => next(err));
})
.put((req, res, next) => {
    ProduitsAdmin.findById(req.params.produitId)
    .then((produit) => {
        if (produit != null) {
            ProduitsAdmin.findByIdAndUpdate(req.params.produitId, { $set: req.body }, { new: true })
            .then((produit) => {
                ProduitsAdmin.findById(produit._id)
                .then((produit) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(produit); 
                });               
            })
            .catch((err) => next(err));
        }
        else {
            err = new Error('Produit ' + req.params.produitId + ' introuvable');
            err.status = 404;
            return next(err);            
        }
    })
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    ProduitsAdmin.findById(req.params.produitId)
    .then((produit) => {
        if (produit != null) {
            ProduitsAdmin.findByIdAndRemove(req.params.produitId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            })
            .catch((err) => next(err));
        }
        else {
            err = new Error('Produit ' + req.params.produitId + ' introuvable');
            err.status = 404;
            return next(err);            
        }
    })
    .catch((err) => next(err));
});

produitAdminRouter.route('/categories/:categorieId')
.get((req, res, next) => {
    ProduitsAdmin.find({ categorie: req.params.categorieId })
    .then((produits) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(produits);
    })
    .catch((err) => next(err));
});

produitAdminRouter.use(express.static('public/imagesProduits'));

module.exports = produitAdminRouter;
