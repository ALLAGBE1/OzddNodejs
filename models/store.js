const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    nomproduit: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true,
        min: 0
    },
    image: {  
        type: String,
        default: ''
    },
    // categorie: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Categorie',
    //     required: true
    // }
}, {
    timestamps: true
});

const ProduitsAdmin = mongoose.model('Produit', storeSchema);
module.exports = ProduitsAdmin;
