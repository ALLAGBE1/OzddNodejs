var express = require('express');
const bodyParser = require('body-parser');
var Formations = require('../models/formations');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var formation = express.Router();
formation.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, 'public/imagesFormations'); // Dossier de destination pour les fichiers images
      } else if (file.mimetype === 'application/pdf') {
        cb(null, 'public/pdfFormations'); // Dossier de destination pour les fichiers PDF
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


formation.route('/')
    .get((req, res, next) => {
        Formations.find(req.query)
        .then((produits) => {
            const transformedProducts = produits.map(produit => {
                produit = produit.toObject();

                let imageName = produit.image;
                produit.afficheUrl = `${imageName}`;

                // Récupérez uniquement le nom du fichier à partir de documentfournirId
                let fileName = path.basename(produit.documentfournirId);
                
                // Utilisez ce nom de fichier pour créer l'URL de téléchargement
                produit.downloadUrl = `/download/${fileName}`;

                return produit;
            })

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transformedProducts); // Utilisez les données transformées
        })
        .catch((err) => next(err));
    });

formation.get('/images/:imageName', (req, res, next) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/imagesFormations', imageName);

    // Vérifiez que le fichier image existe
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})

// Route de téléchargement
formation.get('/download/:filename', (req, res) => {
    console.log(req.params.filename);
    const file = path.join(__dirname, '../public/pdfFormations', req.params.filename);
    if (fs.existsSync(file)) {
        res.download(file);
    } else {
        res.status(404).send("Fichier non trouvé");
    }
});


// Route POST pour créer une nouvelle formation
formation.route('/').post(upload.fields([
    { name: 'imagePath', maxCount: 1 },
    { name: 'documentfournirId', maxCount: 1 }
  ]), async (req, res) => {
    try {
        // Récupérez les données du formulaire à partir de req.body
        const { titre, prix } = req.body;
    
        // Récupérez les chemins d'accès aux fichiers téléchargés à partir de req.files
        // const imagePath = req.files['imagePath'][0].path;
        // const imagePath = `${req.protocol}://${req.get('host')}/formations/${req.files['imagePath'][0].path}`;
        // const imagePath = `${req.protocol}://${req.get('host')}/formations/${req.files['imagePath'][0].filename}`;
        const imagePath = `https://ozdd.onrender.com/formations/${req.files['imagePath'][0].filename}`;
        console.log("aaaaaaaaaaaa", imagePath)
        const documentPath = req.files['documentfournirId'][0].path;
        console.log("bbbbbbbbbbbb", documentPath)

    
        const nouvelleFormation = await Formations.create({
            titre: titre,
            prix: prix,
            imagePath: imagePath,
            documentfournirId: documentPath
        });

        console.log("Formation Créée :", nouvelleFormation);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(nouvelleFormation);
    }
    catch (err) {
        console.error("Erreur lors de la création de la formation :", err);
        res.status(500).json({ error: err.message || "Une erreur est survenue lors de la création de la formation." });
    }
});


formation.route('/')
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Opération PUT non prise en charge sur /Produits/');
    })

formation.route('/')
    .delete((req, res, next) => {
        Formations.deleteMany({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));    
    });


formation.use(express.static('public/imagesFormations'));

module.exports = formation;