const express = require('express');
const bodyParser = require('body-parser');
const Categories = require('../models/categories');

const categorieRouter = express.Router();
categorieRouter.use(bodyParser.json());

categorieRouter.route('/')
.get((req, res, next) => {
    Categories.find(req.query)
    .then((categories) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Categories.create(req.body)
    .then((categorie) => {
        console.log("Categorie Créée :", categorie);
        res.statusCode = 200;  
        res.setHeader('Content-Type', 'application/json');
        res.json(categorie);
    })
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Opération PUT non prise en charge sur /categories');
})
.delete((req, res, next) => {
    Categories.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => next(err));
});


categorieRouter.route('/:categorieId')
.get((req,res,next) => {
    Categories.findById(req.params.categorieId)
    .then((categorie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categorie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Opération POST non prise en charge sur /categories/'+ req.params.categorieId);
})
.put((req, res, next) => {
    Categories.findByIdAndUpdate(req.params.categorieId, {
        $set: req.body
    }, { new: true })
    .then((categorie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categorie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Categories.findByIdAndRemove(req.params.categorieId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = categorieRouter;