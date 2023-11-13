const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produitsFournisseursSchema = new Schema({
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {  
        type: String,
        default: ''
    },
    prix: {
        type: String,
        required: true,
        min: 0
    },
    apercu: {
        type: String,
        required: true
    },
    nomEntreprise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur',
        // required: true
    }
}, {
    timestamps: true
});

const ProduitsFournisseurs = mongoose.model('ProduitFournisseur', produitsFournisseursSchema);
module.exports = ProduitsFournisseurs;
