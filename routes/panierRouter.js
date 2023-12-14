const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Paniers = require('../models/panier');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const panierRouter = express.Router();
panierRouter.use(bodyParser.json());

// :::::::::::::::::::::::
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/imagesPaniers'); // Définit le répertoire de stockage
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //   cb(null, file.originalname + '-' + uniqueSuffix); // Ajoute un timestamp au nom du fichier
        cb(null, uniqueSuffix + '-' +  file.originalname); // Ajoute un timestamp au nom du fichier

    }
  });
  
  const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Vous ne pouvez télécharger que des fichiers images !'), false);
    }
    cb(null, true);
  };
  
  const upload = multer({ storage: storage, fileFilter: imageFileFilter });

  
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/imagesPaniers'); // Définit le répertoire de stockage
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname); // Définit le nom du fichier
//     }
//   });
  
//   const imageFileFilter = (req, file, cb) => {
//     if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//         return cb(new Error('Vous ne pouvez télécharger que des fichiers images !'), false);
//     }
//     cb(null, true);
//   };
  
// const upload = multer({ storage: storage, fileFilter: imageFileFilter });
// ::::::::::::::::::::::

panierRouter.route('/')
    .get((req, res, next) => {
        Paniers.find(req.query)
        // .populate('categorieBlog')
        .then((blogs) => {
            const transformedBlogs = blogs.map(blog => {
                blog = blog.toObject();

                let imageName = blog.image;
                blog.afficheUrl = `${imageName}`;
                return blog;
            })

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transformedBlogs); // Utilisez les données transformées
        })
        .catch((err) => next(err));
    });

panierRouter.get('/images/:imageName', (req, res, next) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/imagesBlogs', imageName);

    // Vérifiez que le fichier image existe
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})


panierRouter.route('/')
    .post(upload.single('image'), async (req, res, next) => {
        try {
            console.log("zzzzzzzzzzzzzzzzzzzz");
            const { nom, prix, quentite, total  } = req.body;
            // const imageUrl = `${req.protocol}://${req.get('host')}/blogs/${req.file.originalname}`;
            const imageUrl = `https://ozdd.onrender.com/paniers/${req.file.originalname}`;
            console.log("aaaaaaaaaaaaaaaa", imageUrl);
            // const imageUrl = `${req.protocol}://${req.get('host')}/blogs/${req.file.originalname}`;
            // console.log("aaaaaaaaaaaaaaaa", imageUrl);

            const blog = await Paniers.create({
                image: imageUrl,
                nom: nom,
                prix: prix,
                quentite: quentite,
                total: total
            });

            console.log("Produit Créé :", blog);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(blog);
        } catch (err) {
            console.error("Erreur lors de la création du blog :", err);
            res.status(500).json({ error: err.message || "Une erreur est survenue lors de la création du blog." });
        }
    });


panierRouter.route('/')
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Opération PUT non prise en charge sur /blogs/');
    })

panierRouter.route('/')
    .delete((req, res, next) => {
        Paniers.deleteMany({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));    
    });


panierRouter.route('/panier/:blogId')
.get((req, res, next) => {
    Paniers.findById(req.params.blogId)
    .then((blog) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    })
    .catch((err) => next(err));
})
.put((req, res, next) => {
    Paniers.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            Paniers.findByIdAndUpdate(req.params.blogId, { $set: req.body }, { new: true })
            .then((blog) => {
                Paniers.findById(blog._id)
                .then((blog) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog); 
                });               
            })
            .catch((err) => next(err));
        }
        else {
            err = new Error('Blog ' + req.params.blogId + ' introuvable');
            err.status = 404;
            return next(err);            
        }
    })
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Paniers.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            Paniers.findByIdAndRemove(req.params.blogId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            })
            .catch((err) => next(err));
        }
        else {
            err = new Error('Blog ' + req.params.blogId + ' introuvable');
            err.status = 404;
            return next(err);            
        }
    })
    .catch((err) => next(err));
});



panierRouter.use(express.static('public/imagesPaniers'));

module.exports = panierRouter;
