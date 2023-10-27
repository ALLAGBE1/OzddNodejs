const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formationSchema = new Schema({
    titre: {
        type: String,
        required: true
    },
    prix: {
        type: String,
        default: ''
    },
    documentfournirId: {  // Si vous stockez le chemin du fichier
        type: String,
        required: true
    },
    imagePath: {  
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Formations = mongoose.model('Formation', formationSchema);
module.exports = Formations;






// :::::::::::::::::

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const formationSchema = new Schema({
//     titre: {
//         type: String,
//         required: true
//     },
//     image: {  
//         type: String,
//         required: true
//     },
//     prix: {
//         type: String,
//         default: ''
//         // type: Number,
//         // required: true,
//         // min: 0
//     },
//     documentfournirId: {  // Si vous stockez le chemin du fichier
//         type: String,
//         default: ''
//     },
//     // categorieFormation: {
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: 'CategorieFormation',
//     //     required: true
//     // },
// }, {
//     timestamps: true
// });

// const Formations = mongoose.model('Formation', formationSchema);
// module.exports = Formations;
