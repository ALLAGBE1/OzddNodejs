const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // image: {  
    //     type: String,
    //     default: ''
    // },
    image: {  
        type: Buffer, // Changement du type à Buffer
        default: Buffer.from('') // Vous pouvez définir une valeur par défaut appropriée
    },
    apercu: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Blogs = mongoose.model('Blog', blogSchema);
module.exports = Blogs;
















// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const blogSchema = new Schema({
//     titre: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     image: {  
//         type: String,
//         default: ''
//     },
//     apercu: {
//         type: String,
//         required: true
//     },
//     // categorieBlog: {
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: 'CategorieBlog',
//     //     // required: true
//     // }
// }, {
//     timestamps: true
// });

// const Blogs = mongoose.model('Blog', blogSchema);
// module.exports = Blogs;
