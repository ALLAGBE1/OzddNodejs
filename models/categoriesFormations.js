const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorieFormationSchema = new Schema({
    categorieFormation: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const CategoriesFormations = mongoose.model('CategorieFormation', categorieFormationSchema);
module.exports = CategoriesFormations;