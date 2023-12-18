var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fournisseurSchema = new Schema({
    numeroTel: {
      type: String,
        default: ''
    },
    nomEntreprise: {
      type: String,
        default: ''
    },
    fournisseur: {
      type: Boolean,
      default: false
    },
    // logoEntreprise: {  
    //     type: String,
    //     required: true
    // },
    logoEntreprise: {  
      type: Buffer, // Changement du type à Buffer
      default: Buffer.from('') // Vous pouvez définir une valeur par défaut appropriée
    },
    pieceIdentite: {  
      type: Buffer, // Changement du type à Buffer
      default: Buffer.from('') // Vous pouvez définir une valeur par défaut appropriée
    },
    // pieceIdentite: {
    //   type: String,
    //   required: true
    // },
    pays: {
        type: String,
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});


const Fournisseurs = mongoose.model('Fournisseur', fournisseurSchema);
module.exports = Fournisseurs;

