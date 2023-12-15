const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ProduitsFournisseurs = require('../models/produitsFournisseurs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const produitFournisseurRouter = express.Router();
produitFournisseurRouter.use(bodyParser.json());

let nameimage = "";
// :::::::::::::::::::::::
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/imagesProduitsFournisseurs'); // Définit le répertoire de stockage
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      //   cb(null, file.originalname + '-' + uniqueSuffix); // Ajoute un timestamp au nom du fichier
        nameimage = uniqueSuffix + '-' +  file.originalname;
        cb(null, nameimage); // Ajoute un timestamp au nom du fichier

    }
    // filename: (req, file, cb) => {
    //   cb(null, file.originalname); // Définit le nom du fichier
    // }
  });
  
  const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Vous ne pouvez télécharger que des fichiers pdf !'), false);
    }
    cb(null, true);
  };
  
const upload = multer({ storage: storage, fileFilter: imageFileFilter });
// ::::::::::::::::::::::

produitFournisseurRouter.route('/')
    .get((req, res, next) => {
        ProduitsFournisseurs.find(req.query)
        // .populate('fournisseur')
        .then((produits) => {
            // const transformedProducts = produits.map(produit => {
            //     produit = produit.toObject();

            //     let imageName = produit.image;
            //     produit.afficheUrl = `${imageName}`;
            //     return produit;
            // })

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(produits); // Utilisez les données transformées
        })
        .catch((err) => next(err));
    });

produitFournisseurRouter.get('/images/:imageName', (req, res, next) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/imagesProduitsFournisseurs', imageName);

    // Vérifiez que le fichier image existe
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})


produitFournisseurRouter.route('/')
    .post(upload.single('image'), async (req, res, next) => {
        try {
            console.log("zzzzzzzzzzzzzzzzzzzz");
            const { titre, description, prix, apercu, nomEntreprise } = req.body;
            // const imageUrl = `${req.protocol}://${req.get('host')}/produitsFournisseurs/${req.file.originalname}`;
            const imageUrl = `https://ozdd.onrender.com/produitsFournisseurs/${nameimage}`;
            // const imageUrl = `https://ozdd.onrender.com/produitsFournisseurs/${req.file.originalname}`;
            console.log("aaaaaaaaaaaaaaaa", imageUrl);

            const produit = await ProduitsFournisseurs.create({
                titre: titre,
                description: description,
                image: imageUrl,
                prix: prix,
                apercu: apercu,
                nomEntreprise: nomEntreprise,
                
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


produitFournisseurRouter.route('/')
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Opération PUT non prise en charge sur /Produits/');
    })

produitFournisseurRouter.route('/')
    .delete((req, res, next) => {
        ProduitsFournisseurs.deleteMany({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));    
    });


produitFournisseurRouter.route('/produit/:produitId')
.get((req, res, next) => {
    ProduitsFournisseurs.findById(req.params.produitId)
    .populate('nomEntreprise')
    .then((produit) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(produit);
    })
    .catch((err) => next(err));
})
.put((req, res, next) => {
    ProduitsFournisseurs.findById(req.params.produitId)
    .then((produit) => {
        if (produit != null) {
            ProduitsFournisseurs.findByIdAndUpdate(req.params.produitId, { $set: req.body }, { new: true })
            .then((produit) => {
                ProduitsFournisseurs.findById(produit._id)
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
    ProduitsFournisseurs.findById(req.params.produitId)
    .then((produit) => {
        if (produit != null) {
            ProduitsFournisseurs.findByIdAndRemove(req.params.produitId)
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

produitFournisseurRouter.route('/fournisseurs/:fournisseurId')
.get((req, res, next) => {
    ProduitsFournisseurs.find({ nomEntreprise: req.params.fournisseurId })
    .then((produits) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(produits);
    })
    .catch((err) => next(err));
});

produitFournisseurRouter.use(express.static('public/imagesProduitsFournisseurs'));

module.exports = produitFournisseurRouter;
