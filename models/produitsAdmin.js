const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produitSchema = new Schema({
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
        type: Number,
        required: true,
        min: 0
    },
    apercu: {
        type: String,
        required: true
    },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        // required: true
    }
}, {
    timestamps: true
});

const ProduitsAdmin = mongoose.model('Produit', produitSchema);
module.exports = ProduitsAdmin;
