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
    image: {  
        type: String,
        default: ''
    },
    apercu: {
        type: String,
        required: true
    },
    // categorieBlog: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'CategorieBlog',
    //     // required: true
    // }
}, {
    timestamps: true
});

const Blogs = mongoose.model('Blog', blogSchema);
module.exports = Blogs;
