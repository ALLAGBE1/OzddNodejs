var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    lastName: {
      type: String,
        default: ''
    },
    firstName: {
      type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    },
    email: {
      type: String,
      unique: true, // Assurez-vous d'avoir un index unique sur le champ email
      required: true // Assurez-vous que l'email est obligatoire
    }
});

User.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', User);
