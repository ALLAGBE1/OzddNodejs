// const express = require('express');
// const bodyParser = require('body-parser');
// const CategoriesBlog = require('../models/categoriesBlog');

// const categorieBlogRouter = express.Router();
// categorieBlogRouter.use(bodyParser.json());

// categorieBlogRouter.route('/')
// .get((req, res, next) => {
//     CategoriesBlog.find(req.query)
//     .then((categoriesblog) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(categoriesblog);
//     })
//     .catch((err) => next(err));
// })
// .post((req, res, next) => {
//     CategoriesBlog.create(req.body)
//     .then((categorieblog) => {
//         console.log("Categorie Créée :", categorieblog);
//         res.statusCode = 200;  
//         res.setHeader('Content-Type', 'application/json');
//         res.json(categorieblog);
//     })
//     .catch((err) => next(err));
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('Opération PUT non prise en charge sur /categoriesBlog');
// })
// .delete((req, res, next) => {
//     CategoriesBlog.deleteMany({})
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     })
//     .catch((err) => next(err));
// });


// categorieBlogRouter.route('/:categorieBlogId')
// .get((req,res,next) => {
//     CategoriesBlog.findById(req.params.categorieBlogId)
//     .then((categorieblog) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(categorieblog);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end('Opération POST non prise en charge sur /categoriesBlog/'+ req.params.categorieBlogId);
// })
// .put((req, res, next) => {
//     CategoriesBlog.findByIdAndUpdate(req.params.categorieBlogId, {
//         $set: req.body
//     }, { new: true })
//     .then((categorieblog) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(categorieblog);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .delete((req, res, next) => {
//     CategoriesBlog.findByIdAndRemove(req.params.categorieBlogId)
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// module.exports = categorieBlogRouter;