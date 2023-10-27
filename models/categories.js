const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorieSchema = new Schema({
    categorie: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Categories = mongoose.model('Categorie', categorieSchema);
module.exports = Categories;
