const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Blogs = require('../models/blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const blogsRouter = express.Router();
blogsRouter.use(bodyParser.json());

var nameimage = "";

// :::::::::::::::::::::::
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/imagesProduits'); // Définit le répertoire de stockage
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

blogsRouter.route('/')
    .get((req, res, next) => {
        Blogs.find(req.query)
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

blogsRouter.get('/images/:imageName', (req, res, next) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/imagesBlogs', imageName);

    // Vérifiez que le fichier image existe
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
})


blogsRouter.route('/')
    .post(upload.single('image'), async (req, res, next) => {
        try {
            console.log("zzzzzzzzzzzzzzzzzzzz");
            const { titre, description, apercu  } = req.body;
            // const imageUrl = `${req.protocol}://${req.get('host')}/blogs/${req.file.originalname}`;
            const imageUrl = `https://ozdd.onrender.com/blogs/${nameimage}`;
            // const imageUrl = `https://ozdd.onrender.com/blogs/${req.file.originalname}`;
            console.log("aaaaaaaaaaaaaaaa", imageUrl);
            // const imageUrl = `${req.protocol}://${req.get('host')}/blogs/${req.file.originalname}`;
            // console.log("aaaaaaaaaaaaaaaa", imageUrl);

            const blog = await Blogs.create({
                titre: titre,
                description: description,
                image: imageUrl,
                apercu: apercu
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


blogsRouter.route('/')
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Opération PUT non prise en charge sur /blogs/');
    })

blogsRouter.route('/')
    .delete((req, res, next) => {
        Blogs.deleteMany({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        })
        .catch((err) => next(err));    
    });


blogsRouter.route('/blog/:blogId')
.get((req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    })
    .catch((err) => next(err));
})
.put((req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            Blogs.findByIdAndUpdate(req.params.blogId, { $set: req.body }, { new: true })
            .then((blog) => {
                Blogs.findById(blog._id)
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
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            Blogs.findByIdAndRemove(req.params.blogId)
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

blogsRouter.route('/categories/:categorieblogId')
.get((req, res, next) => {
    Blogs.find({ categorie: req.params.categorieblogId })
    .then((blogs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogs);
    })
    .catch((err) => next(err));
});

blogsRouter.use(express.static('public/imagesBlogs'));

module.exports = blogsRouter;
