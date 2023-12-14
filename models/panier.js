var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var panierSchema = new Schema({
    image:  {
        type: String,
        required: true,
        default: ''
    },
    nom: {
      type: String,
      required: true,
        default: ''
    },
    prix: {
        type: Currency,
        required: true,
        min: 0
    },
    quentite: {
        type: Number,
        required: true,
            default: 1
    },
    total: {
        type: Currency,
        required: true,
            default: ''
    },  
}, {
    timestamps: true
});

const Paniers = mongoose.model('Panier', panierSchema);
module.exports = Paniers;



