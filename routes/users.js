var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();  
router.use(bodyParser.json());


router.get('/', (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    })
    .catch((err) => next(err));
});

router.post('/sinscrire', async (req, res, next) => {
  try {
    console.log("555555555555555555555555555555555555555");
    if (!req.body.email || req.body.email.trim() === '') {
      // Vérifie si l'email est vide ou non défini
      // throw new Error('L\'adresse e-mail est requise.');
      throw new Error('Tous les champs sont requis.'); // Ou une autre gestion d'erreur appropriée
    }

    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

    const user = await User.register(
      new User({ email: req.body.email, lastName: req.body.lastName, firstName: req.body.firstName, }),
      req.body.password
    );

    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    // if (req.body.lastName) user.lastName = req.body.lastName;
    // if (req.body.firstName) user.firstName = req.body.firstName;
    

    // await user.save();

    passport.authenticate('local')(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Inscription réussie !' });
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: false, status: 'Une erreur s\'est produite lors de l\'enregistrement.' });
  }
});


router.post('/connexion', /*cors.corsWithOptions,*/ (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      const response = {
        success: false,
        status: 'Connexion échouée !',
        err: info,
      }
      console.log(response);
      res.json(response);
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: false,
          status: 'Connexion échouée !',
          err: "Impossible de connecter l'utilisateur !",
        });
        console.log(res.json({
          success: false,
          status: 'Connexion échouée !',
          err: "Impossible de connecter l'utilisateur !",
        }));
        return;
      }

      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      result = res.json({
        success: true,
        status: 'Connexion réussie !',
        token: token,
        user: user,
      });
      // console.log(result);
      console.log("Super************************");
    });
  })(req, res, next);
});

router.get('/logout', /*cors.cors,*/ (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
    console.log("T'es logout");
  } else {
    var err = new Error("Vous n'êtes pas connecté !");
    err.status = 403;
    next(err);
  }
});


module.exports = router;
