const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Blogs = require('../models/blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const blogsRouter = express.Router();
blogsRouter.use(bodyParser.json());

// Configure multer for file upload
// const multer = require('multer');
const storage = multer.memoryStorage(); // Store images as buffers in memory
const upload = multer({ storage: storage });

// var nameimage = "";

// // :::::::::::::::::::::::
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/imagesProduits'); // Définit le répertoire de stockage
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       //   cb(null, file.originalname + '-' + uniqueSuffix); // Ajoute un timestamp au nom du fichier
//         nameimage = uniqueSuffix + '-' +  file.originalname;
//         cb(null, nameimage); // Ajoute un timestamp au nom du fichier
//     }
//     // filename: (req, file, cb) => {
//     //   cb(null, file.originalname); // Définit le nom du fichier
//     // }
//   });
  
//   const imageFileFilter = (req, file, cb) => {
//     if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//         return cb(new Error('Vous ne pouvez télécharger que des fichiers pdf !'), false);
//     }
//     cb(null, true);
//   };
  
// const upload = multer({ storage: storage, fileFilter: imageFileFilter });
// ::::::::::::::::::::::

blogsRouter.route('/')
    .get((req, res, next) => {
        Blogs.find(req.query)
            .then((blogs) => {
                const transformedBlogs = blogs.map(blog => {
                    blog = blog.toObject();

                    // Inclure les données binaires de l'image et le type de l'image dans la réponse JSON
                    blog.imageData = {
                        data: blog.image.toString('base64'),
                        type: blog.imageType
                    };

                    return blog;
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(transformedBlogs);
            })
            .catch((err) => next(err));
    });


// blogsRouter.route('/')
//     .get((req, res, next) => {
//         Blogs.find(req.query)
//             .then((blogs) => {
//                 const transformedBlogs = blogs.map(blog => {
//                     blog = blog.toObject();

//                     // Inclure les données binaires de l'image dans la réponse JSON
//                     blog.imageData = blog.image.toString('base64');

//                     return blog;
//                 })

//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(transformedBlogs);
//             })
//             .catch((err) => next(err));
//     });


// blogsRouter.route('/')
//     .get((req, res, next) => {
//         Blogs.find(req.query)
//         // .populate('categorieBlog')
//         .then((blogs) => {
//             const transformedBlogs = blogs.map(blog => {
//                 blog = blog.toObject();

//                 let imageName = blog.image;
//                 blog.afficheUrl = `${imageName}`;
//                 return blog;
//             })

//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(transformedBlogs); // Utilisez les données transformées
//         })
//         .catch((err) => next(err));
//     });

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
      const { titre, description, apercu } = req.body;
      const imageBuffer = req.file.buffer;

      const blog = await Blogs.create({
        titre: titre,
        description: description,
        image: imageBuffer, // Store image as buffer directly in the document
        apercu: apercu
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(blog);
    } catch (err) {
      console.error("Erreur lors de la création du blog :", err);
      res.status(500).json({ error: err.message || "Une erreur est survenue lors de la création du blog." });
    }
  });


// blogsRouter.route('/')
//     .post(upload.single('image'), async (req, res, next) => {
//         try {
//             console.log("zzzzzzzzzzzzzzzzzzzz");
//             const { titre, description, apercu  } = req.body;
//             // const imageUrl = `${req.protocol}://${req.get('host')}/blogs/${req.file.originalname}`;
//             const imageUrl = `https://ozdd.onrender.com/blogs/${nameimage}`;
//             // const imageUrl = `https://ozdd.onrender.com/blogs/${req.file.originalname}`;
//             console.log("aaaaaaaaaaaaaaaa", imageUrl);
//             // const imageUrl = `${req.protocol}://${req.get('host')}/blogs/${req.file.originalname}`;
//             // console.log("aaaaaaaaaaaaaaaa", imageUrl);

//             const blog = await Blogs.create({
//                 titre: titre,
//                 description: description,
//                 image: imageUrl,
//                 apercu: apercu
//             });

//             console.log("Produit Créé :", blog);
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(blog);
//         } catch (err) {
//             console.error("Erreur lors de la création du blog :", err);
//             res.status(500).json({ error: err.message || "Une erreur est survenue lors de la création du blog." });
//         }
//     });


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
// .get((req, res, next) => {
//     Blogs.findById(req.params.blogId)
//     .then((blog) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(blog);
//     })
//     .catch((err) => next(err));
// })
.get((req, res, next) => {
    Blogs.findById(req.params.blogId)
        .then((blog) => {
            if (!blog) {
                res.status(404).json({ message: "Blog not found" });
                return;
            }

            const responseData = {
                // _id: blog._id,
                titre: blog.titre,
                description: blog.description,
                // Inclure le type et les données binaires de l'image dans la réponse JSON
                image: {
                    type: blog.imageType, // Assurez-vous de définir blog.imageType correctement
                    data: blog.image.toString('base64'),
                },
            };

            res.status(200).json(responseData);
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
