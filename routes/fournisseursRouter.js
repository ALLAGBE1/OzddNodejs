var express = require('express');
const bodyParser = require('body-parser');
var Fournisseurs = require('../models/fournisseur');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var fournisseur = express.Router();
fournisseur.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, 'public/logoEntreprise'); // Dossier de destination pour les fichiers images
      } else if (file.mimetype === 'application/pdf') {
        cb(null, 'public/pieceIdentite'); // Dossier de destination pour les fichiers PDF
      } else {
        cb(new Error('Invalid file type')); // Rejeter les autres types de fichiers
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Définir le nom du fichier téléchargé
    }
  });
  
  
  // Filtrage des types de fichiers acceptés
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      cb(null, true); // Accepte le fichier
    } else {
      cb(null, false); // Rejette le fichier
    }
  };
  
  // Configuration de Multer avec les options de stockage et de filtrage
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  });


fournisseur.route('/')
  .get((req, res, next) => {
    Fournisseurs.find(req.query)
    .populate('userId')
    .then((fournisseurs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fournisseurs); // Utilisez les données transformées
    })
    .catch((err) => next(err));
  });
    

fournisseur.get('/images/:imageName', (req, res, next) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/logoEntreprise', imageName);

    // Vérifiez que le fichier image existe
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})

// Route de téléchargement
fournisseur.get('/download/:filename', (req, res) => {
    console.log(req.params.filename);
    const file = path.join(__dirname, '../public/pieceIdentite', req.params.filename);
    if (fs.existsSync(file)) {
        res.download(file);
    } else {
        res.status(404).send("Fichier non trouvé");
    }
});


// Route POST pour créer une nouvelle fournisseur
fournisseur.route('/').post(upload.fields([
    { name: 'logoEntreprise', maxCount: 1 },
    { name: 'pieceIdentite', maxCount: 1 }
  ]), async (req, res) => {
    try {
        // Récupérez les données du formulaire à partir de req.body
        const { numeroTel, nomEntreprise, pays  } = req.body;
    
        // const imagePath = `${req.protocol}://${req.get('host')}/fournisseurs/${req.files['logoEntreprise'][0].filename}`;
        const imagePath = `https://ozdd.onrender.com/fournisseurs/${req.files['logoEntreprise'][0].filename}`;
        console.log("aaaaaaaaaaaa", imagePath);
        // const documentPath = `${req.protocol}://${req.get('host')}/fournisseurs/download/${req.files['pieceIdentite'][0].filename}`;
        const documentPath = `https://ozdd.onrender.com/fournisseurs/download/${req.files['pieceIdentite'][0].filename}`;
        console.log("bbbbbbbbbbbb", documentPath);

    
        const nouvelleFournisseur = await Fournisseurs.create({
            numeroTel: numeroTel,
            nomEntreprise: nomEntreprise,
            logoEntreprise: imagePath,
            pieceIdentite: documentPath,
            pays: pays,
            // userId: userId
        });

        console.log("Fournisseur Créée :", nouvelleFournisseur);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(nouvelleFournisseur);
    }
    catch (err) {
        console.error("Erreur lors de la création de la fournisseur :", err);
        res.status(500).json({ error: err.message || "Une erreur est survenue lors de la création de la fournisseur." });
    }
});

fournisseur.route('/valides').get((req, res, next) => {
    Fournisseurs.find({ fournisseur: true })
    .populate('userId')
    .then((produits) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(produits);
    })
    .catch((err) => next(err));
});

fournisseur.route('/:fournisseurId')
.get((req,res,next) => {
    Fournisseurs.findById(req.params.fournisseurId)
    .then((categorie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categorie);
    }, (err) => next(err))
    .catch((err) => next(err));
})

fournisseur.put('/update/:updateId', (req, res, next) => {
  Fournisseurs.findByIdAndUpdate(req.params.updateId, {
      $set: req.body
  }, { new: true })
  .then((categorie) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(categorie);
  }, (err) => next(err))
  .catch((err) => next(err));
});



// fournisseur.route('/')
//     .put((req, res, next) => {
//         res.statusCode = 403;
//         res.end('Opération PUT non prise en charge sur /Produits/');
//     })

fournisseur.route('/')
    .delete((req, res, next) => {
        Fournisseurs.deleteMany({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));    
    });


fournisseur.use(express.static('public/logoEntreprise'));

module.exports = fournisseur;